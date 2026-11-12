# Style bible: doodle contrast reels

Measured from 12 reference reels (the newest public reels of the studied page, 2026-11-12). Every number comes from
`tools/measure.mjs`, `tools/palette.mjs`, `tools/linewidth.mjs` and `templates/remotion/scripts/transcribe.mjs`.
Raw output is in `references/measure/*.json` and `references/transcripts/*.json`. The reports in
`references/reports/` have the per-topic detail.

**Use this for the look and the formula. Story, characters, jokes, handle and sponsor are always your own.**

## 1. The format (12/12 reels)
Every reel is a **labelled comparison**. A hand-lettered title in the top band names the comparison. The video then
plays the sides one after another:

| Pattern | Reels | Shape |
|---|---|---|
| `A VS. B` | 6 | Title names both. Play A (normal), then B (escalated) |
| `A:` / `B:` | 2 | The label swaps when the side changes ("TALL PEOPLE:" → "SHORT PEOPLE:") |
| `HOW X DOES Y` (two versions) | 2 | The same scene played twice. The second time escalates |
| Ranked list (`JOBS WITH THE MOST AURA`) | 1 | 4-5 items. Each item gets its own label plus a number ("PILOT $150K-$260K") |
| Time-skip (`DAY: 1 → 9 → 190 → 999`) | 1 | One subject. The counter label changes with each beat |

### Beat formula
1. **Title + side A at frame 0.** No intro and no logo. The title is already on screen in the first frame.
2. **A is the relatable, deadpan version.** It is small, slow, and tells one joke.
3. **Label swap.** The new label ("B:", "DADS:") fades in over ~8 frames, often through a light paper dissolve.
4. **B escalates 3-4 times.** Each step is bigger than the last: a power-up aura, leaving the room or the planet, space, explosions.
5. **Punchline: the over-rendered figure.** It cuts from the simple doodle to an absurdly detailed, shaded, heroic or
   realistic version of the same idea, held 1-2 s. This happens in 8/12 reels (muscle giants, a caped dad, a rendered
   moto racer, an astronaut). It is the biggest laugh, and it works because of the contrast in rendering quality.
6. **Twist / sting.** One last beat that undercuts it, often back in the small doodle world.
7. **Sponsor slot (optional, 6/12 reels).** In the last ~25-35 %, an app UI insert appears, usually a real screenshot
   in a drawn phone or laptop, with one voiced line ("Do X with <app>"). The insert is part of the gag.

## 2. Timing (24 fps, 1080x1920)
| Measure | Median | Range | Note |
|---|---|---|---|
| Length | 27.5 s | 19-40 s | |
| Hard cuts | 7.6 /min | 2-15 /min | The camera mostly *travels* into the next moment |
| Median shot | 4.3 s | 2.3-14.5 s | |
| Title band visible | 6.9 s | 0-19 s | Roughly the length of segment A |
| Camera moving (in-shot frames) | 49.5 % | 32-59 % | |
| …of which pull-out | 26 % of frames | | Pull-outs reveal the joke |
| …of which push-in | 16 % of frames | | ~0.1-0.2 % zoom per frame |
| Drawing changes | 15 /s | 11.6-19.3 | Mostly animated on ones (smooth puppet tweens) |
| Holds of exactly 2 f | 9 % of changes | | "On twos" for limbs and expressions |
| Holds ≥ 12 f | 88 runs in 12 reels | | Reaction holds and the punchline |
| Big non-cut changes (smear, flash, shake) | 25 per reel | 0-109 | Impact frames, white flashes, shakes |
| First hard cut | 1.5-16.4 s | | Many reels play the whole of A as one shot |

## 3. Look
| | Value |
|---|---|
| Paper | `#e6cdc4` (60-89 % of every frame). Flat, with no texture, grain or vignette |
| Character fill | The **same as the paper**. A lighter `#f3e3dc` only when the character must pop |
| Ink | Warm black `#150500`. Lines are 6 px at 1080 wide (p25 5, p75 8). Round caps, slight wobble, no line boil on holds |
| Night / lights off | `#4c4444` warm dark grey. Line art stays the same |
| Space | `#2c3c4c` navy with white cross stars |
| Accent | One muted red `#b8433f`, on small areas only (a hat, blood, an object) |
| Power-up | Cyan `#7cfcec` with a `#dcfcfc` core: auras, beams |
| Punchline render | Greys `#94847c`/`#4c4444` plus gradients, rim light and hatching. A detailed body on the same simple head logic |
| Real-photo inserts | Gym machines, phones, app UIs and game screens cut out onto the paper (mixed media) |
| Title | Hand-lettered ALL CAPS. Centred, spans 65-75 % of the width, baseline ~10 % from the top, 1-3 lines |

## 4. Sound (whisper.cpp transcripts, 12/12)
- **No narrator** in 11 of 12 reels.
- The sound is **music bed + cartoon SFX + non-verbal voice**: growling, panting, screaming, laughing, gibberish,
  "Hello!", snoring.
- **Dialogue lines are rare.** One reel has a short skit exchange.
- **Music cuts dead** for the twist. Silence or a record scratch sells the sting.
- **The sponsor read** is one line in a normal voice at the end (6/12).
- **Loudness is −14.1 LUFS integrated on every reel measured**, which is Instagram's normalisation target. The
  volumedetect mean is −14.6 to −18.1 dB.

## 5. Rules for OUR shorts
- Write your own comparison, characters, jokes and twist. Never copy a reference reel's premise, gag or character
  design. Examples of their recurring designs we do not use: the propeller-hat kid and the meme faces.
- Never show or say the studied page's name or handle. Sign with **your** handle only.
- Keep the reference videos, sheets and frames private. They are `.gitignore`d and never committed.
