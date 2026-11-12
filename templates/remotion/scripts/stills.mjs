// Render many stills from ONE bundle (much faster than `remotion still` per frame).
//   node scripts/stills.mjs <outPrefix> <frame,frame,...|all-shots> [scale=0.5] [comp=DoodleShortSilent]
// "all-shots" renders the middle frame of every shot in story.ts — the quickest whole-film check.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [prefix = "out/stills/x_", list = "all-shots", scale = "0.5", comp = "DoodleShortSilent"] = process.argv.slice(2);
let frames;
if (list === "all-shots") {
  const { SHOTS } = await import("../src/videos/alarm/story.ts");
  frames = SHOTS.map(s => Math.floor((s.a + s.b) / 2));
} else frames = list.split(",").map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY || "src/index.ts") });
// Windows: paths over 260 chars cannot launch remotion.exe. Set REMOTION_BIN to a short folder holding a copy of
// node_modules/@remotion/compositor-<platform> (see SKILL.md gotchas).
const binariesDirectory = process.env.REMOTION_BIN || null;
const browserExecutable = process.env.REMOTION_CHROME || null; // same long-path issue for chrome-headless-shell.exe
const composition = await selectComposition({ serveUrl, id: comp, binariesDirectory, browserExecutable });
fs.mkdirSync(path.dirname(prefix), { recursive: true });
for (const frame of frames) {
  const output = `${prefix}${String(frame).padStart(4, "0")}.png`;
  await renderStill({ serveUrl, composition, frame, output, scale: Number(scale), binariesDirectory, browserExecutable });
  console.log(output);
}
