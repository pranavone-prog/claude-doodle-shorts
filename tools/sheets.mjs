#!/usr/bin/env node
// Contact sheets: every N seconds of video -> one image with EVERY frame on it (24 fps -> 48 tiles per 2 s).
//
//   node tools/sheets.mjs <video.mp4> [outDir] [--sec 2] [--w 180]
//
// The whole point: Claude reading a few frames misses the micro-animation. One sheet = every frame of a window.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (!args[0]) { console.error("usage: node tools/sheets.mjs <video> [outDir] [--sec 2] [--w 180]"); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
const video = args[0];
const name = path.basename(video).replace(/\.[^.]+$/, "");
const outDir = path.join(args[1] && !args[1].startsWith("--") ? args[1] : "references/sheets", name);
const SEC = opt("--sec", 2), W = opt("--w", 180), H = Math.round(W * 16 / 9);

const pr = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries",
  "stream=r_frame_rate:format=duration", "-of", "json", video], { encoding: "utf8" });
const j = JSON.parse(pr.stdout);
const [a, b] = j.streams[0].r_frame_rate.split("/").map(Number);
const fps = a / b, dur = Number(j.format.duration);
const per = Math.round(fps * SEC), cols = 8, rows = Math.ceil(per / cols);

fs.mkdirSync(outDir, { recursive: true });
// drawtext labels each tile with its frame number so findings can cite exact frames.
const font = process.platform === "win32" ? "fontfile='C\\:/Windows/Fonts/arial.ttf':" : "";
const vf = `scale=${W}:${H},drawtext=${font}text='%{frame_num}':x=4:y=4:fontsize=14:fontcolor=red:box=1:boxcolor=white@0.7,` +
  `tile=${cols}x${rows}:padding=3:color=white`;
const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", video, "-vf", vf, "-q:v", "4",
  path.join(outDir, "s%03d.jpg")], { encoding: "utf8" });
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`${name}: ${Math.ceil(dur / SEC)} sheets of ${per} frames (${fps} fps) -> ${outDir}`);
