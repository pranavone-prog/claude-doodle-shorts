# Motion and camera (measured)

Tool: `node tools/measure.mjs <reel>` decodes **every** frame at 135x240.

- **Camera:** each frame is matched against the frame 6 earlier in the same shot, with a zoom + shift search
  (bilinear sampling, coarse to fine). Whatever that move explains is the camera.
- **Drawing:** the camera-compensated residual between neighbouring frames is the drawing changing.
- **Hard cut:** a big luma jump that settles within 2 frames. Jumps that keep changing (smears, flashes, shakes) are
  counted as `fxFrames` instead.

| # | sec | cuts | cuts/min | median shot s | fx frames | cam moving % | push-in % | pull-out % | push %/f | drawing changes/s | title s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 30.0 | 2 | 4.0 | 10.8 | 11 | 50.3 | 19.2 | 22.8 | 0.20 | 13.0 | 9.8 |
| 02 | 20.0 | 5 | 15.0 | 3.1 | 44 | 43.0 | 11.3 | 23.1 | 0.30 | 15.9 | 11.3 |
| 03 | 27.5 | 2 | 4.4 | 7.5 | 109 | 46.6 | 15.6 | 25.8 | 0.10 | 15.3 | 9.2 |
| 04 | 25.3 | 5 | 11.8 | 2.4 | 39 | 45.0 | 17.4 | 24.3 | 0.10 | 17.9 | 10.0 |
| 05 | 39.2 | 4 | 6.1 | 4.3 | 20 | 58.6 | 21.7 | 31.8 | 0.10 | 14.5 | 6.0 |
| 06 | 24.6 | 2 | 4.9 | 7.2 | 0 | 32.5 | 7.2 | 19.3 | 0.10 | 12.2 | 1.4 |
| 07 | 27.1 | 1 | 2.2 | 14.5 | 24 | 48.0 | 7.9 | 28.9 | 0.08 | 13.6 | 6.9 |
| 08 | 39.6 | 10 | 15.1 | 2.3 | 50 | 49.5 | 8.1 | 31.3 | 0.37 | 15.3 | 19.0 |
| 09 | 27.5 | 3 | 6.5 | 6.5 | 0 | 51.4 | 12.6 | 30.8 | 0.20 | 11.6 | 0.0 |
| 10 | 31.5 | 4 | 7.6 | 3.7 | 29 | 40.0 | 13.7 | 12.2 | 0.20 | 14.1 | 4.0 |
| 11 | 22.5 | 3 | 8.0 | 3.8 | 4 | 59.3 | 16.9 | 36.2 | 0.08 | 19.3 | 4.3 |
| 12 | 19.0 | 4 | 12.6 | 3.8 | 25 | 54.9 | 20.6 | 20.2 | 0.10 | 16.3 | 4.4 |
| **median** | **27.5** | | **7.6** | **4.3** | **25** | **49.5** | **15.6** | **25.8** | **0.10** | **15.3** | **6.9** |

Held-drawing run lengths over all 12 reels:

| Run length | Count |
|---|---|
| 1 f | 4220 |
| 2 f | 427 |
| 3 f | 65 |
| 4 f | 51 |
| 5-11 f | 79 |
| ≥ 12 f | 88 |

## Findings
1. **Few cuts.** The median is 7.6 per minute. The camera glides between framings on one set (wide → CU → wide). Hard
   cuts are kept for a change of place or a punchline.
2. **The camera moves on about half of all frames.** Pull-outs (26 % of frames) outnumber push-ins (16 %). A slow push
   runs at about 0.1 %/frame.
3. **The drawing changes on most frames.** Puppet-style tweens run on ones. Limbs and expressions hold for 2 frames in
   about 9 % of changes. Holds of 12 frames or more are the reactions and punchlines.
4. **About 25 impact/fx frames per reel:** white flashes, black speed-line frames and shakes.
5. **Measure, don't eyeball.** One contact sheet of reel 01 looked like a push-in. The title width stayed at 189 px for
   75 frames, so the camera was still.

## Recipe in our stack
- One `Key<Cam>[]` track per set (`BED_CAM` in `videos/alarm/Short.tsx`). Shots read a window of it with
  `track(keys, a)`. That is how a glide replaces a cut.
- Glides between framings use `easeIO` and last 6-20 f. Wide holds are truly still. Only reaction holds creep, at about
  0.1-0.2 %/f.
- Impacts: `kick(f, at, amp, 7)` is a shake that flips sign every frame. `Flash` and `SpeedBurst` make the 2-4 f
  impact frames.
- Stepping: `onN(f, 2)` puts limbs and faces on twos. Camera and position tweens stay on ones.

## Our demo after the fix (same tool)
See `out/measure_ours/video.json`. Targets: cuts/min 2-15, camera moving 35-60 %, push-in ≤ 25 %, −14 LUFS.
