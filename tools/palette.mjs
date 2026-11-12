#!/usr/bin/env node
// Dominant colours across a video (sampled), quantised to 4 bits/channel.  node tools/palette.mjs <video> [every=1] [top=12]
import { spawnSync } from "node:child_process";
const [video, every = "1", top = "12"] = process.argv.slice(2);
const r = spawnSync("ffmpeg", ["-v", "error", "-i", video, "-vf", `fps=1/${every},scale=270:480`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 2e9 });
const b = r.stdout, h = new Map();
for (let i = 0; i < b.length; i += 3) { const k = ((b[i] >> 3) << 10) | ((b[i + 1] >> 3) << 5) | (b[i + 2] >> 3); h.set(k, (h.get(k) || 0) + 1); }
const hex = v => (v * 8 + 4).toString(16).padStart(2, "0");
const tot = b.length / 3;
console.log([...h.entries()].sort((a, c) => c[1] - a[1]).slice(0, +top).map(([k, v]) => "#" + hex((k >> 10) & 31) + hex((k >> 5) & 31) + hex(k & 31) + " " + (v / tot * 100).toFixed(1) + "%").join("  "));
