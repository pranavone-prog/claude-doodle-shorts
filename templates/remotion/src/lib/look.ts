// The look, as numbers. Every value here was MEASURED from the reference reels
// (tools/measure.mjs, tools/palette.mjs, tools/linewidth.mjs -> references/reports/*.md).
// Change the look here, never inline in a scene.

export const FPS = 24;              // reference: 24 fps on all 12 reels
export const W = 1080, H = 1920;    // reference: 1080x1920

export const PAPER = "#e6cdc4";     // 60-89 % of every frame (#e4ccc4 quantised); flat, no texture, no vignette
export const PAPER_LIGHT = "#f3e3dc"; // optional lighter fill for a character that must pop off the paper
export const INK = "#150500";       // warm brown-black, never neutral #000
export const INK_W = 6;             // median line run 6 px at 1080 wide (p25 5, p75 8)
export const INK_W_THIN = 4;        // faces, details, far objects
export const NIGHT = "#4c4444";     // lights-off / "B:" second half background (warm dark grey)
export const SPACE = "#2c3c4c";     // sky / space background in escalations
export const SHADE = "#94847c";     // flat shade grey for the over-rendered punchline figure
export const SHADE_DARK = "#4c4444";
export const RED = "#b8433f";       // the ONE accent colour on doodles (hat, blood, alarm) — tiny areas only
export const GLOW = "#7cfcec";      // power-up cyan aura / beams (with white core #dcfcfc)
export const GLOW_CORE = "#dcfcfc";
export const MONEY = "#3cc85a";     // UI greens for money / app inserts only

// Title band (top of frame). Present on ~7 s per reel on average, i.e. the whole first segment.
export const TITLE = {
  y: 0.1,            // first baseline as a fraction of height
  size: 116,         // font px at 1080 wide: the title spans ~65-75 % of the width
  lineGap: 1.05,
  maxChars: 16,      // per line; break "GOOD VS. BAD / GENETICS" style
};

// Timing measured on the reference.
export const TIMING = {
  cutsPerMin: 7.6,         // hard cuts are RARE: the camera glides into the next moment instead
  medianShotSec: 4.3,      // between hard cuts
  holdMin: 2,              // limbs/faces that hold, hold 2 frames ("on twos"); tweens run on ones
  heroHold: 12,            // punchline / reaction holds: 12+ frames
  cameraMovingPct: 49.5,   // % of in-shot frames where the camera moves at all
  pushInPerFrame: 0.1,     // % zoom per frame on a slow push (median of moving frames)
  pullOutShare: 0.62,      // of zoom moves, ~62 % are pull-outs (reveal the joke), 38 % push-ins
  fxFramesPerReel: 25,     // flashes / speed-line frames / shakes per reel
  lufs: -14,               // integrated loudness, all 12 reels -14.0..-14.1
};
