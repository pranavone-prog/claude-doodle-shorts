// Full render from one bundle.  node scripts/render.mjs [out=out/video.mp4] [comp=DoodleShort] [scale=1]
// Loudness: every reference reel measures -14.1 LUFS integrated (Instagram normalisation). The finish pass
// re-encodes only the audio with loudnorm to I=-14, TP=-1 so ours matches.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
const [out = "out/video.mp4", comp = "DoodleShort", scale = "1"] = process.argv.slice(2);
const binariesDirectory = process.env.REMOTION_BIN || null;          // Windows long-path workaround (SKILL.md)
const browserExecutable = process.env.REMOTION_CHROME || null;
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY || "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: comp, binariesDirectory, browserExecutable });
let last = -1;
const raw = out.replace(/.mp4$/, "") + "_raw.mp4";
await renderMedia({ serveUrl, composition, codec: "h264", crf: 18, outputLocation: raw, scale: Number(scale), binariesDirectory, browserExecutable,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${p * 10}%`); } } });
const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", out]);
if (r.status) { console.error(String(r.stderr)); process.exit(1); }
fs.rmSync(raw, { force: true });
console.log("wrote", out);
