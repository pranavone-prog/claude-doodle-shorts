#!/usr/bin/env node
// Ink line width + colour at full resolution: horizontal & vertical dark-run lengths over sampled frames.
//   node tools/linewidth.mjs <video> [everySeconds=1]
// Prints median/p25/p75 run length (px at the video's width) and the median ink colour.
import { spawnSync } from "node:child_process";
const [video, every = "1"] = process.argv.slice(2);
const pr = JSON.parse(spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json", video], { encoding: "utf8" }).stdout).streams[0];
const W = pr.width, H = pr.height;
const r = spawnSync("ffmpeg", ["-v", "error", "-i", video, "-vf", `fps=1/${every}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 4e9 });
const b = r.stdout, F = W * H * 3, n = Math.floor(b.length / F);
const runs = [], cols = [];
const dark = (o) => 0.2126 * b[o] + 0.7152 * b[o + 1] + 0.0722 * b[o + 2] < 90;
for (let f = 0; f < n; f++) {
  const o = f * F;
  for (let y = Math.round(H * 0.2); y < H * 0.95; y += 7) { let run = 0; for (let x = 0; x < W; x++) { const p = o + (y * W + x) * 3; if (dark(p)) { run++; if (run === 2) cols.push([b[p], b[p + 1], b[p + 2]]); } else { if (run > 0 && run < 30) runs.push(run); run = 0; } } }
  for (let x = 0; x < W; x += 7) { let run = 0; for (let y = Math.round(H * 0.2); y < H * 0.95; y++) { const p = o + (y * W + x) * 3; if (dark(p)) run++; else { if (run > 0 && run < 30) runs.push(run); run = 0; } } }
}
runs.sort((a, c) => a - c);
const q = p => runs[Math.floor(runs.length * p)];
const m = k => cols.map(c => c[k]).sort((a, c) => a - c)[Math.floor(cols.length / 2)];
const hex = v => v.toString(16).padStart(2, "0");
console.log(JSON.stringify({ video, frames: n, runs: runs.length, p25: q(0.25), median: q(0.5), p75: q(0.75), inkColour: "#" + hex(m(0)) + hex(m(1)) + hex(m(2)) }));
