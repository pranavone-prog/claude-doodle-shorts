// "MONDAY VS. FRIDAY ALARMS" — the demo short. Pure data (no JSX) so Node scripts can import it too
// (node >= 23 strips the types): scripts/cues.mjs reads SFX + SHOTS to build the sound.
//
// Beat formula (references/STYLE_BIBLE.md):
//   TITLE  "A VS. B" in the top band, visible for all of segment A (~7 s)
//   A      the relatable, deadpan version — small, slow, one joke
//   CARD   "B:" title card (fades in), same set
//   B      the same situation, escalated 3-4 times, each bigger, ending absurd (space, aura, power-up)
//   PUNCH  cut to the over-rendered version, held 1.5-2 s
//   TWIST  one last cut back to the small doodle world that undercuts it all
// No narration: the reference reels are carried by music + SFX + grunts.

export const FPS = 24;

export type Shot = { id: string; a: number; b: number; note: string };
export const SHOTS: Shot[] = [
  { id: "A_wide",   a: 0,   b: 66,  note: "asleep, Zs, title on" },
  { id: "A_ring",   a: 66,  b: 96,  note: "clock rings, sleeper does not move" },
  { id: "A_eye",    a: 96,  b: 132, note: "CU dead-eyed stare, slow push" },
  { id: "A_smash",  a: 132, b: 162, note: "arm rises, slams clock" },
  { id: "A_back",   a: 162, b: 204, note: "back to sleep, pull-out" },
  { id: "B_card",   a: 204, b: 228, note: "FRIDAY: card fades in, clock restored" },
  { id: "B_ring",   a: 228, b: 240, note: "first ring -> eyes snap open (CU)" },
  { id: "B_launch", a: 240, b: 262, note: "launches out of bed, bed flips" },
  { id: "B_flex",   a: 262, b: 304, note: "lands, goes swole, aura" },
  { id: "B_roof",   a: 304, b: 352, note: "outside: through the roof into the night" },
  { id: "B_burst",  a: 352, b: 356, note: "impact frame" },
  { id: "B_hero",   a: 356, b: 404, note: "PUNCH: over-rendered hero in front of the moon" },
  { id: "C_twist",  a: 404, b: 444, note: "back in bed — calendar says SAT" },
  { id: "C_end",    a: 444, b: 504, note: "smash, flop, Zs. end hold" },
];
export const TOTAL = SHOTS[SHOTS.length - 1].b;
export const shot = (id: string) => SHOTS.find(s => s.id === id)!;

// Sound events in ABSOLUTE frames. name = a file in public/sfx (made by scripts/sfx.mjs).
// Rule: a sound lands 0-2 frames BEFORE the visual it belongs to.
export type Cue = { f: number; name: string; gain?: number; len?: number };
export const SFX: Cue[] = [
  { f: 0, name: "snore", gain: 0.6, len: 66 },
  { f: 66, name: "ring", gain: 0.8, len: 66 },
  { f: 147, name: "smash", gain: 1 },
  { f: 149, name: "debris", gain: 0.6 },
  { f: 166, name: "snore", gain: 0.6, len: 38 },
  { f: 204, name: "pop", gain: 0.5 },
  { f: 227, name: "ring", gain: 0.8, len: 12 },
  { f: 229, name: "boing", gain: 0.8 },
  { f: 239, name: "whoosh", gain: 1 },
  { f: 263, name: "thud", gain: 1 },
  { f: 270, name: "powerup", gain: 0.8 },
  { f: 304, name: "crash", gain: 0.9 },
  { f: 306, name: "whoosh", gain: 0.8 },
  { f: 351, name: "boom", gain: 1 },
  { f: 356, name: "choir", gain: 0.9 },
  { f: 403, name: "scratch", gain: 0.9 },
  { f: 405, name: "ring", gain: 0.8, len: 46 },
  { f: 451, name: "smash", gain: 1 },
  { f: 466, name: "snore", gain: 0.6, len: 38 },
];

// Music: one loop under everything, cut dead at the punchline scratch (silence makes the twist land).
export const MUSIC = { a: 0, b: 403, gain: 0.35, resumeAt: 444 };
