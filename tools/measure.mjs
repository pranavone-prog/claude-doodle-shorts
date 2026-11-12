#!/usr/bin/env node
// Frame-by-frame measuring tool for doodle reels. Node + ffmpeg only (no Python needed).
//
//   node tools/measure.mjs <video.mp4> [outDir] [--w 135] [--k 6]
//
// Decodes EVERY frame (native fps) at a small size and writes <outDir>/<name>.json:
//   per frame : luma, ink %, colour %, title-band ink %, raw diff, camera zoom/shift, drawing residual
//   summary   : paper colour, hard cuts, camera moving %, push-in speed, held-drawing runs
//               ("animated on 1s/2s/3s"), title time, colour-insert time
//
// Camera vs drawing: frames K apart in the same shot are matched with a zoom + shift search
// (bilinear, coarse-to-fine). Whatever the camera move cannot explain is the drawing changing.
// "Don't ask Claude what it thinks of a video. Make it measure."
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (!args[0]) { console.error("usage: node tools/measure.mjs <video> [outDir] [--w 135] [--k 6]"); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
const video = args[0];
const outDir = args[1] && !args[1].startsWith("--") ? args[1] : "references/measure";
const W = opt("--w", 135), H = Math.round(W * 16 / 9), K = opt("--k", 6);
const CUT = 14;     // raw mean |Δluma| (0-255) between consecutive frames that counts as a hard cut
const HOLD = 1.0;   // camera-compensated residual below this = the drawing did not change

const probe = await new Promise((res, rej) => {
  const p = spawn("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "json", video]);
  let s = ""; p.stdout.on("data", d => (s += d)); p.on("close", c => (c ? rej(new Error("ffprobe failed")) : res(JSON.parse(s))));
});
const [fn, fd] = probe.streams[0].r_frame_rate.split("/").map(Number);
const fps = fn / fd;

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const chroma = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);
const N = W * H, TB = Math.round(H * 0.17);

// ---------- pass 1: decode + per-frame colour stats ----------
const lumas = [], frames = [];
const paperHist = new Map();
function stats(px) {
  const Y = new Float32Array(N);
  let L = 0, ink = 0, col = 0, top = 0;
  for (let i = 0, k = 0; k < N; i += 3, k++) {
    const r = px[i], g = px[i + 1], b = px[i + 2], l = lum(r, g, b), c = chroma(r, g, b);
    Y[k] = l; L += l;
    if (l < 70) { ink++; if (k < W * TB) top++; } else if (c > 60) col++;
    if (l > 150 && c < 60) { const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3); paperHist.set(key, (paperHist.get(key) || 0) + 1); }
  }
  lumas.push(Y);
  frames.push({ luma: +(L / N / 255).toFixed(4), ink: +(ink / N * 100).toFixed(2), colour: +(col / N * 100).toFixed(2), titleInk: +(top / (W * TB) * 100).toFixed(2) });
}
await new Promise((res, rej) => {
  const p = spawn("ffmpeg", ["-v", "error", "-i", video, "-vf", `scale=${W}:${H}:flags=area`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
  let buf = Buffer.alloc(0); const FB = N * 3;
  p.stdout.on("data", d => { buf = Buffer.concat([buf, d]); while (buf.length >= FB) { stats(buf.subarray(0, FB)); buf = buf.subarray(FB); } });
  p.on("close", c => (c ? rej(new Error("ffmpeg failed")) : res()));
});

// ---------- pass 2: cuts ----------
const rawDiff = (a, b) => { let e = 0; for (let k = 0; k < N; k++) e += Math.abs(a[k] - b[k]); return e / N; };
frames[0].diff = null;
const cutAt = new Set([0]);
for (let i = 1; i < frames.length; i++) frames[i].diff = +rawDiff(lumas[i], lumas[i - 1]).toFixed(3);
// A hard cut = a big jump that then SETTLES (next two frames calm). Fast smears, flashes and
// shake keep changing, so they are counted as animation instead ("fx" frames).
let lastCut = 0;
for (let i = 1; i < frames.length; i++) {
  const calm = j => j >= frames.length || frames[j].diff < CUT * 0.35;
  if (frames[i].diff > CUT && calm(i + 1) && calm(i + 2) && i - lastCut >= 3) { cutAt.add(i); lastCut = i; }
  frames[i].fx = frames[i].diff > CUT && !cutAt.has(i);
}
const shotStart = []; let cur = 0;
for (let i = 0; i < frames.length; i++) { if (cutAt.has(i)) cur = i; shotStart.push(cur); }

// ---------- pass 3: camera (zoom + shift) between frames K apart ----------
function sample(Y, x, y) {
  if (x < 0 || y < 0 || x > W - 1.001 || y > H - 1.001) return -1;
  const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * W + x0;
  return (Y[i] * (1 - fx) + Y[i + 1] * fx) * (1 - fy) + (Y[i + W] * (1 - fx) + Y[i + W + 1] * fx) * fy;
}
// error of cur(x,y) vs prev(cx + (x-cx)/s - dx, cy + (y-cy)/s - dy). s > 1 = push-in (content grows).
function err(A, B, s, dx, dy, step = 2) {
  const cx = W / 2, cy = H / 2; let e = 0, n = 0;
  for (let y = 10; y < H - 10; y += step) for (let x = 6; x < W - 6; x += step) {
    const v = sample(A, cx + (x - cx) / s - dx, cy + (y - cy) / s - dy);
    if (v < 0) continue; e += Math.abs(B[y * W + x] - v); n++;
  }
  return n ? e / n : Infinity;
}
function match(A, B, span) {
  const zr = 0.008 * span;                    // max zoom searched grows with the gap
  let best = { e: err(A, B, 1, 0, 0), s: 1, dx: 0, dy: 0 };
  for (let s = 1 - zr; s <= 1 + zr + 1e-9; s += zr / 8) { const e = err(A, B, s, 0, 0); if (e < best.e) best = { e, s, dx: 0, dy: 0 }; }
  const sr = Math.min(8, 2 * span);
  for (let dy = -sr; dy <= sr; dy++) for (let dx = -sr; dx <= sr; dx++) { const e = err(A, B, best.s, dx, dy); if (e < best.e) best = { ...best, e, dx, dy }; }
  const b0 = { ...best };
  for (let ds = -zr / 8; ds <= zr / 8 + 1e-9; ds += zr / 32) for (let ry = -0.75; ry <= 0.75; ry += 0.25) for (let rx = -0.75; rx <= 0.75; rx += 0.25) {
    const e = err(A, B, b0.s + ds, b0.dx + rx, b0.dy + ry); if (e < best.e) best = { e, s: b0.s + ds, dx: b0.dx + rx, dy: b0.dy + ry };
  }
  return best;
}
for (let i = 0; i < frames.length; i++) {
  const j = Math.max(shotStart[i], i - K), span = i - j;
  if (span < 2) { frames[i].zoom = 0; frames[i].dx = 0; frames[i].dy = 0; continue; }
  const m = match(lumas[j], lumas[i], span);
  frames[i].zoom = +((Math.pow(m.s, 1 / span) - 1) * 100).toFixed(3);   // % per frame
  frames[i].dx = +(m.dx / span * 1080 / W).toFixed(2);                   // px per frame at 1080 wide
  frames[i].dy = +(m.dy / span * 1080 / W).toFixed(2);
}

// ---------- pass 4: drawing residual frame-to-frame with the camera removed ----------
for (let i = 1; i < frames.length; i++) {
  if (cutAt.has(i)) { frames[i].residual = null; continue; }
  const f = frames[i], s = 1 + f.zoom / 100;
  frames[i].residual = +err(lumas[i - 1], lumas[i], s, f.dx * W / 1080, f.dy * W / 1080, 1).toFixed(3);
}

// ---------- summary ----------
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const hex = v => v.toString(16).padStart(2, "0");
const top = [...paperHist.entries()].sort((a, b) => b[1] - a[1])[0];
const paper = top ? "#" + hex(((top[0] >> 10) & 31) * 8 + 4) + hex(((top[0] >> 5) & 31) * 8 + 4) + hex((top[0] & 31) * 8 + 4) : null;

const runs = []; let run = 1;
for (let i = 1; i < frames.length; i++) {
  if (frames[i].residual !== null && frames[i].residual < HOLD) run++; else { runs.push(run); run = 1; }
}
runs.push(run);
const runHist = {};
for (const r of runs) { const k = r >= 12 ? "12+" : String(r); runHist[k] = (runHist[k] || 0) + 1; }
const inShot = frames.filter((f, i) => !cutAt.has(i) && i - shotStart[i] >= 2);
const moving = inShot.filter(f => Math.abs(f.zoom) >= 0.03 || Math.hypot(f.dx, f.dy) >= 0.5);
const cuts = [...cutAt].filter(i => i > 0).map(i => +(i / fps).toFixed(2));
const dur = frames.length / fps;

const summary = {
  file: path.basename(video), fps, frames: frames.length, seconds: +dur.toFixed(2),
  paperColour: paper,
  medianLuma: med(frames.map(f => f.luma)),
  medianInkPct: med(frames.map(f => f.ink)),
  hardCuts: cuts, hardCutsPerMinute: +(cuts.length / dur * 60).toFixed(1),
  fxFrames: frames.filter(f => f.fx).length,   // big frame-to-frame changes that are not cuts (smears, flashes, shakes)
  medianShotSeconds: +(med([...cutAt].sort((a, b) => a - b).map((c, i, a) => ((a[i + 1] ?? frames.length) - c) / fps)) ?? 0).toFixed(2),
  cameraMovingPct: +(moving.length / Math.max(1, inShot.length) * 100).toFixed(1),
  medianPushInPctPerFrame: med(moving.filter(f => f.zoom > 0.03).map(f => f.zoom)),
  pushInPct: +(moving.filter(f => f.zoom > 0.03).length / Math.max(1, inShot.length) * 100).toFixed(1),
  pullOutPct: +(moving.filter(f => f.zoom < -0.03).length / Math.max(1, inShot.length) * 100).toFixed(1),
  drawingChangesPerSecond: +(runs.length / dur).toFixed(2),
  heldRunHistogram: runHist,     // {"2": 40} = 40 times a drawing was held exactly 2 frames
  medianHoldFrames: med(runs),
  titleBandSeconds: +(frames.filter(f => f.titleInk > 1.2).length / fps).toFixed(2),
  colourHeavySeconds: +(frames.filter(f => f.colour > 8).length / fps).toFixed(2),
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, path.basename(video).replace(/\.[^.]+$/, "") + ".json"), JSON.stringify({ summary, frames }));
console.log(JSON.stringify(summary));
