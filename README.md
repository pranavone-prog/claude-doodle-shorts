# Claude Doodle Shorts

A Claude skill for making **hand-drawn doodle comparison reels**: "A VS. B", "A: / B:", "HOW X DOES Y", ranked lists
and "DAY 1 → 999" time-skips. The look is flat pinkish paper, warm-black line-art bean characters, a hand-lettered
title band, escalation into absurdity, an over-rendered punchline figure, and music + cartoon SFX with no narrator.

Everything is rendered as SVG inside [Remotion](https://www.remotion.dev/) on your own PC, with no AI video
generator. Every tool is **Node + ffmpeg**, so you do not need Python.

It follows the workflow from *"How to Make Viral Animated Shorts Using Claude"*, adapted from 3D cartoons to 2D
doodles:
1. Download a page's newest reels.
2. **Measure** them frame by frame: don't ask for opinions, collect numbers.
3. Write a style bible and per-topic reports.
4. Build a template.
5. Make a demo.
6. Measure the demo with the same tools and fix the gaps.

Proven on **MONDAY VS. FRIDAY ALARMS** (`examples/monday-vs-friday-alarms.mp4`), an original 21 s reel.

## What's inside
| Path | What it is |
|---|---|
| `SKILL.md` | The skill: the pipeline, every rule, every fix and the final look values |
| `references/STYLE_BIBLE.md` | The format and visual formula measured from 12 reference reels |
| `references/reports/` | Measured reports: `motion.md` (cuts, camera, holds), `look.md` (colour, ink, characters), `sound.md` |
| `tools/measure.mjs` | Every-frame analysis: hard cuts vs. fx frames, camera zoom/shift (sub-pixel), held-drawing runs, title time, paper colour |
| `tools/sheets.mjs` | Contact sheets with every frame on them, numbered (48 frames per 2 s at 24 fps) |
| `tools/palette.mjs`, `tools/linewidth.mjs` | Dominant colours; ink line width and colour at full resolution |
| `templates/remotion/` | The Remotion project: `src/lib/` (look, ink, doodle rig, props, fx, camera/title) and `src/videos/alarm/` (the demo) |
| `templates/remotion/scripts/` | `stills.mjs`, `render.mjs` (with a −14 LUFS finish), `sfx.mjs` (synth SFX + original music), `transcribe.mjs` + `whisper-setup.mjs` (whisper.cpp word timings) |
| `templates/SCRIPT_example.md` | A beat sheet to copy for a new reel |
| `examples/` | The rendered demo |

## Key measured numbers
| Measure | Value |
|---|---|
| Length | 19-40 s at 24 fps |
| Paper | `#e6cdc4` |
| Ink | `#150500`, 6 px at 1080 wide |
| Hard cuts | 7.6 /min (the camera glides instead) |
| Camera moving | ~50 % of frames |
| Title band | ~7 s |
| Narration | None in 11/12 reels |
| Loudness | −14 LUFS on every reel |

Full tables are in `references/`.

## Install
1. Copy this folder to `~/.claude/skills/doodle-contrast-short/`.
2. In `templates/remotion/`:
   - Run `npm install`.
   - Run `node scripts/sfx.mjs` to make the sound files.
   - Optionally run `node scripts/whisper-setup.mjs` (~1.5 GB, only needed to transcribe references or your voice).
3. You need Node ≥ 23 and ffmpeg on PATH. yt-dlp is only needed to study a new reference.
4. In Claude Code, say: *"Use the doodle short skill and make a reel about …"*.

**Windows:** keep the project at a short path (e.g. `C:\dev\doodle`). See the MAX_PATH gotcha in `SKILL.md`.

## Notes
- **Make your own content.** Use your own story, characters, jokes, sounds and handle. The references are for the
  look and the formula, not the content.
- **Reference material stays private.** The downloaded reference reels, contact sheets and per-frame JSON live in
  `references/vids|sheets|overview|measure|transcripts`. Those folders are `.gitignore`d and never committed.
- **Brand assets:** app screenshots or logos in a sponsor slot must be ones you have the rights to use.

## License
The code and docs are MIT (see `LICENSE`).
