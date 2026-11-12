# Colour, ink and characters (measured)

## Colour
Tool: `node tools/palette.mjs <reel> 1 14` builds a 5-bit quantised histogram from 1 frame per second at 270x480.

| Reel | Top colours (share of all pixels) |
|---|---|
| 05 (all day) | `#e4ccc4` 89.0 %, `#040404` 0.7, `#343434` 0.6, `#fcfcfc` 0.6, `#345ca4` 0.1 (tears) |
| 06 (lights go off) | `#e4ccc4` 59.2 %, `#4c4444` 26.9, `#94847c` 0.9, `#944c4c` 0.2 |
| 08 (space escalation) | `#e4ccc4` 61.4 %, `#2c3c4c` 12.8, `#0c0c14` 2.9, `#fcfcfc` 2.7, `#a4ecec` 0.6, `#7cfcec` 0.4 |

`measure.mjs` finds the paper colour `#ecd4c4` (reels 01-03) or `#e4ccc4` (reels 04-12). The median luma is 0.79.
"Colour-heavy" time (more than 8 % saturated pixels) has a median of 0.9 s per reel, so colour is an event, not the
base.

**Rules**
- The paper is a flat `#e6cdc4`, with no texture or vignette. Only the punchline render may carry a vignette.
- Characters are filled with the paper colour, so they read as line drawings on the page.
- Use one muted accent per reel (`#b8433f`).
- Scene states:

  | State | Colour |
  |---|---|
  | Night | `#4c4444` |
  | Space | `#2c3c4c` with stars |
  | Power-up | Cyan `#7cfcec` |

- Saturated colour lives in real-photo and app-UI inserts.

## Ink
Tool: `node tools/linewidth.mjs <reel> 2` measures dark-run lengths at full resolution (horizontal and vertical scans)
and the median ink colour.

| Reel | median px | p25 | p75 | ink colour |
|---|---|---|---|---|
| 05 | 5 | 2 | 7 | `#160702` |
| 06 | 6 | 5 | 8 | `#150500` |
| 09 | 6 | 6 | 8 | `#100000` |
| 11 | 7 | 6 | 9 | `#180704` |

**Rules**
- Colour: `INK = #150500` (warm). Never `#000`.
- Width: 6 px at 1080 wide (`INK_W`) for bodies and props, 4 px (`INK_W_THIN`) for faces and details.
- Shape: round caps. Loops are slightly imperfect (`blob()` with about 3 % wobble).
- Holds: no line boil. The residual on a hold is at the codec noise floor. `Boil` is opt-in, for nervous beats only.
- Lettering: a monoline hand font in ALL CAPS, the same ink colour.

## Characters (from the 2 s / 48-frame contact sheets)
- **Body:** a big round head (about 40 % of the height), a tiny bean torso, outlined noodle limbs (an ink stroke under
  a paper stroke), mitten hands and small oval feet.
- **Faces:** dots or ovals for eyes and one line for the mouth. Emotion comes from the brows, the eye shape and the
  mouth, and is exaggerated: gritted teeth, giant shocked eyes, crying streams. There is no blush and no nose.
- **Swole state:** the same head with a wide V-torso and thick limbs. It pops in over 6-8 frames.
- **Punchline render:** the deliberate opposite. Detailed anatomy, grey gradients, hatching, rim light, sometimes a
  cape or vignette. Held 1-2 s.
- **Secondary motion:** sweat drops, tremble arcs, Zs and speed streaks, all line art.
- **Ours:** `lib/doodle.tsx` `Bean` / `Head` (12 faces, 5 hats, joint-angle poses plus `buff`/`sit`/`squash`) and
  `HeroRender` in `lib/props.tsx`.
- Do not reuse the studied page's recurring characters (the propeller-hat kid, the meme faces). Design your own cast.
