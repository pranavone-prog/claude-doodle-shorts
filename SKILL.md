---
name: doodle-contrast-short
description: Make a ~20-40 s vertical hand-drawn "doodle comparison" reel ("A VS. B", "A: / B:", "HOW X DOES Y", ranked lists, DAY 1 → 999). It uses flat pinkish-paper backgrounds, warm-black line-art bean characters, a hand-lettered title band, glide-don't-cut cameras, escalation into absurdity, an over-rendered punchline figure, and music + cartoon SFX with no narrator. Everything is rendered as SVG inside Remotion on your own PC, with no AI video generator. Use when the user asks for a "doodle reel", a "stick-figure comparison short", "a reel like the doodle ones", an Instagram/TikTok comedy comparison in this hand-drawn style, or says "use the doodle short skill".
---

# Doodle contrast short (SVG + Remotion)

Proven example: **MONDAY VS. FRIDAY ALARMS**, an original 21 s reel.
- Code: `templates/remotion/src/videos/alarm/` (composition `DoodleShort`, 1080x1920, 24 fps).
- Style research: `references/` (STYLE_BIBLE.md, reports/*.md, measured JSON).

The style reference is a page studied privately: its 12 newest reels, downloaded for measurement only.
- The videos, sheets and frames are private study material. They are `.gitignore`d. Never upload, publish or send them.
- Never copy their premises, gags, characters or shots. Story, characters, jokes, sound and handle are always OUR OWN.
- Never show or say the studied page's name or handle in a video, caption or description.

## Pipeline
1. **Topic.** Pick one relatable comparison with a visual escalation. Choose a pattern (STYLE_BIBLE §1):
   - `A VS. B`
   - `A: / B:`
   - `HOW X DOES Y` (two versions)
   - a ranked list
   - a `DAY: N` time-skip

   Write it at the top of `SCRIPT.md` (see `templates/SCRIPT_example.md`).
2. **Beat sheet** (20-40 s at 24 fps). Use this formula:

   | Beat | What happens |
   |---|---|
   | Title + A at frame 0 | No intro |
   | A | Deadpan and small. One joke |
   | Label swap | The new label fades in over ~8 f |
   | B | Escalates 3-4 times, each step bigger, ending absurd (aura, power-up, leaving the room or planet, space) |
   | **Punchline** | Cut to an over-rendered version of the same idea, held 1-2 s |
   | Twist / sting | One beat back in the doodle world that undercuts it all |
   | Optional sponsor slot | Last 25-35 %: an app insert plus one voiced line |

   Rules:
   - Never explain a joke in text.
   - Labels are the only words on screen, apart from small diegetic labels (a calendar, a price tag, a score).
3. **Shot plan** in `story.ts`. Copy `templates/remotion/src/videos/alarm/` to `src/videos/<name>/` and register a
   composition in `src/Root.tsx`.
   - `SHOTS`: id, absolute a/b frames, note.
   - `SFX`: absolute frame, file name, gain, loop length. A sound lands **0-2 frames before** its visual.
   - `MUSIC`: one loop. It cuts dead at the twist and may come back after.
   - Keep `story.ts` free of JSX: Node scripts import it.
4. **Camera** (in the scene file). Use one continuous `Key<Cam>[]` track per set (`BED_CAM`). Each shot reads its
   window with `track(keys, a)`.
   - **Glide, don't cut:** about 7.6 cuts/min, median shot 4.3 s. Cut only for a change of place or the punchline.
   - Wide holds are **still**. Only reaction holds creep, at 0.1-0.2 %/f.
   - The camera moves on 35-60 % of frames, and pull-outs outnumber push-ins.
   - Impacts: `kick()` shake (sign flip every frame, decays over 7 f) plus a 2-4 f `Flash` or `SpeedBurst`.
5. **Set and props** (`lib/props.tsx`). Draw them as line art with a paper fill.
   - Real-photo or app-UI inserts: put a PNG in `public/` and use `<Img>`. Use only images you own or are licensed to use.
6. **Characters** (`lib/doodle.tsx`).
   - `Bean`: a big round head, tiny torso, outlined noodle limbs and mitten hands.
     - 12 faces. 5 hats.
     - A pose is shoulder/elbow/hip/knee angles plus `buff`, `sit` and `squash`.
   - `Head`: the head alone, for close-ups and sleepers.
   - `HeroRender`: our over-rendered punchline figure. Make a new one per short (other heroes, objects, animals).
   - Fill characters with the paper colour. Use one accent colour at most.
   - Put limbs and faces on twos (`onN(f, 2)`). Tweens and the camera run on ones.
   - Blink every 2-3 s.
7. **FX** (`lib/fx.tsx`): `Zs`, `Tremble`, `Sweat`, `Vein`, `Streaks`, `SpeedBurst`, `Aura`, `Debris`, `Flash`,
   `Stars`, `popScale`.
8. **Sound.**
   - Run `node scripts/sfx.mjs`. It writes 13 synthesized SFX and an original loop to `public/`.
   - There is **no narrator**. Record your own grunts, screams, laughs and gibberish as `public/sfx/<name>.wav` to
     override the synthetic ones.
   - Lock the picture timing before final sound tweaks.
9. **Look checks** (render stills before any video).
   - Stills: `node scripts/stills.mjs out/stills/x_ all-shots 0.5` (the middle frame of every shot, from one bundle).
   - Contact sheets of the reference and ours:
     - `node tools/sheets.mjs <video> <outDir>` puts every frame on the sheet, numbered.
     - Compare them side by side.
   - Fix: framing, title collisions, overflowing text, dead air (empty frames), unreadable shapes.
10. **Render and measure.**
    - Render: `node scripts/render.mjs out/video.mp4`. It finishes with loudnorm to −14 LUFS.
    - Measure ours with the same tool: `node tools/measure.mjs out/video.mp4 out/measure_ours`. Compare against
      `references/reports/motion.md`.

      | Measure | Target |
      |---|---|
      | Cuts/min | 2-15 |
      | Camera moving | 35-60 % |
      | Push-in | ≤ 25 % |
      | Loudness | −14 LUFS |
      | Paper colour | `#e4ccc4` / `#ecd4c4` |
      | Dead air | None (no empty set for more than ~8 f) |

11. **Deliver.** Send the final mp4 and write notes on what changed.

## The look, as numbers (`src/lib/look.ts`)
| | Value |
|---|---|
| Paper | `#e6cdc4`, flat |
| Ink | `#150500`, 6 px (thin 4 px), round caps, imperfect loops, no boil on holds |
| Night | `#4c4444` |
| Space | `#2c3c4c` |
| Accent | `#b8433f` |
| Glow | `#7cfcec` / `#dcfcfc` |
| Shade (punchline) | `#94847c` |
| Title | Patrick Hand, ALL CAPS, 116 px, baseline at 10 % of the height, centred, 1-3 lines, shown on the opening shots of each segment only (~7 s per reel) |
| Format | 24 fps, 1080x1920, 19-40 s (median 27.5 s) |

## Re-measuring a new reference (the look-match loop)
This is how the numbers above were made. Reuse it for any "make it look like X" request.
1. **Download.** Get a page's newest ~12-20 reels into `references/vids/NN_<id>.mp4` with
   `yt-dlp -f "bv*+ba/b" --merge-output-format mp4`. These are for private study only.
2. **Measure** every reel. Measure, don't eyeball: an opinion can't be recreated, a number can.

   | Tool | What it gives |
   |---|---|
   | `node tools/measure.mjs` | Cuts, camera zoom/shift, held-drawing runs, title time, paper colour |
   | `node tools/palette.mjs` | Dominant colours |
   | `node tools/linewidth.mjs` | Ink width and colour |
   | `node tools/sheets.mjs` | Every-frame contact sheets |
   | `node templates/remotion/scripts/transcribe.mjs` | What the audio is (music, SFX, voice) |
   | `ffmpeg -af ebur128` | Loudness |

3. **Write reports.** Put numbers, not adjectives, in `references/reports/*.md`, then summarise them in
   `STYLE_BIBLE.md`.
4. **Build the demo and measure it** with the same tools. Fix the biggest gaps. Repeat.
5. **Using many agents?** Split the *files*, not just the jobs.

   | Owner | Files |
   |---|---|
   | camera | `story.ts`, camera tracks |
   | characters | `doodle.tsx` |
   | props | `props.tsx` |
   | fx | `fx.tsx` |
   | sound | `sfx.mjs` |

   Each agent works in its own copy of `src/videos/<name>_<owner>/` and you merge file by file.

## Gotchas (all hit while building this)
- **Windows MAX_PATH (260 chars).**
  - The problem: in a deep project folder, Node cannot spawn `remotion.exe` (`ENOENT`), and the headless Chrome zip
    half-extracts.
  - The fix: copy `node_modules/@remotion/compositor-win32-x64-msvc/*` to a short folder and set `REMOTION_BIN`.
    Extract `node_modules/.remotion/chrome-headless-shell/*.zip` (PowerShell `Expand-Archive`) to a short folder and
    set `REMOTION_CHROME` to its `chrome-headless-shell.exe`. `scripts/stills.mjs` and `scripts/render.mjs` read both.
  - Or simply keep the project at a short path such as `C:\dev\doodle`.
- **No Python needed.** Every tool is Node plus ffmpeg. Whisper runs through `@remotion/install-whisper-cpp`
  (`node scripts/whisper-setup.mjs`, about 1.5 GB for medium.en).
- **Whisper returns sub-word tokens.** `transcribe.mjs` merges tokens that do not start with a space.
- **Naive cut detection over-fires on smears and flashes** (242 "cuts"/min on one reel). A cut must settle within 2
  frames.
- **A camera push of 0.1 %/f is invisible to a 68-px grid.** Match frames 6 apart at 135 px with sub-pixel sampling.
- **Eyeballing contact sheets lies.** We "saw" a push-in that measuring showed was a still camera.
- **The first demo had 37 cuts/min** against the reference's 7.6. One continuous camera track per set fixed it.
- **After a launch or exit, the set sat empty for 14 frames.** Bring the character back in, or cut.
- **The title band collides with close-ups.** Show the title on the segment's opening shots only.
- **Big diegetic text overflows its prop:** calendar text at 120 px did not fit a 180 px page. Use 92 px.
- **A filled aura washes the character out.** Use a thick cyan outline plus a 22 % fill.
- **The raw render was −20.9 dB against the reference's −14 LUFS.** The finish pass normalises it.
- **`ffmpeg -pattern_type glob` is not available on Windows builds.** Pass the inputs explicitly.
