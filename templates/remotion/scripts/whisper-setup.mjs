// One-time: downloads whisper.cpp + an English model via Remotion's official installer.
//   node scripts/whisper-setup.mjs
import { installWhisperCpp, downloadWhisperModel } from "@remotion/install-whisper-cpp";
import path from "node:path";
const dir = path.resolve(process.env.WHISPER_DIR || "whisper.cpp");
await installWhisperCpp({ to: dir, version: "1.5.5" });
await downloadWhisperModel({ model: "medium.en", folder: dir });
console.log("whisper ready in", dir);
