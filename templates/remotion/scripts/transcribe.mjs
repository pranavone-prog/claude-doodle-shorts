// Transcribe any audio/video to word timings with whisper.cpp (Node + ffmpeg, no Python).
//   node scripts/transcribe.mjs <input.(mp4|wav)> <out.json>
// Output: { text, words: [{ word, start, end }] } in seconds. Used for the reference study AND for your own voice.wav.
import { transcribe, toCaptions } from "@remotion/install-whisper-cpp";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [input, out] = process.argv.slice(2);
if (!input || !out) { console.error("usage: node scripts/transcribe.mjs <input> <out.json>"); process.exit(1); }
const dir = path.resolve(process.env.WHISPER_DIR || path.join(import.meta.dirname, "..", "whisper.cpp"));
const wav = path.join(os.tmpdir(), `tx_${process.pid}.wav`);
const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", input, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
if (r.status) { console.error(String(r.stderr)); process.exit(1); }

const res = await transcribe({ inputPath: wav, whisperPath: dir, whisperCppVersion: "1.5.5", model: "medium.en", tokenLevelTimestamps: true, printOutput: false });
const { captions } = toCaptions({ whisperCppOutput: res });
// whisper tokens are sub-words; a token that starts with a space begins a new word.
const words = [];
for (const c of captions) {
  const t = c.text; if (!t.trim()) continue;
  const last = words[words.length - 1];
  if (last && !/^\s/.test(t)) { last.word += t.trim(); last.end = +(c.endMs / 1000).toFixed(3); }
  else words.push({ word: t.trim(), start: +(c.startMs / 1000).toFixed(3), end: +(c.endMs / 1000).toFixed(3) });
}
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ text: words.map(w => w.word).join(" "), words }, null, 1));
fs.rmSync(wav, { force: true });
console.log(`${path.basename(input)}: ${words.length} words`);
