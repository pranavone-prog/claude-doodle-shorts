import { Easing } from "remotion";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0..1 progress of frame f through [a, b]. */
export const seg = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a));
export const easeIO = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.1, 0.7, 0.2, 1);
export const easeIn = Easing.bezier(0.6, 0, 0.9, 0.4);
/** Overshoot then settle — for pops, landings and "boing". */
export const easeBack = Easing.bezier(0.3, 1.6, 0.5, 1);

/** Animate "on n's": the drawing only changes every n frames (reference: 2 for movement, 1 for camera). */
export const onN = (f: number, n = 2) => Math.floor(f / n) * n;

/** Deterministic pseudo-random in [0,1). Same seed -> same value (Remotion renders frames out of order). */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Impact shake: flips sign every frame, decays over `dur` frames. Returns px offset. */
export const kick = (f: number, at: number, amp = 18, dur = 7) => {
  const t = f - at;
  if (t < 0 || t >= dur) return 0;
  return (t % 2 === 0 ? 1 : -1) * amp * (1 - t / dur);
};

/** Sum of kicks. */
export const kicks = (f: number, list: Array<[number, number?, number?]>) =>
  list.reduce((s, [at, amp, dur]) => s + kick(f, at, amp, dur), 0);

/** Vibrate (strain, rage, cold): random jitter that changes every n frames. */
export const vibrate = (f: number, amp = 3, n = 2, seed = 1) => {
  const k = onN(f, n);
  return { x: (rnd(k * 7.1 + seed) - 0.5) * 2 * amp, y: (rnd(k * 3.7 + seed * 2) - 0.5) * 2 * amp };
};

export type Key<T> = { f: number; v: T; ease?: (t: number) => number };

/** Keyframes with per-key easing; numbers or flat number records are interpolated. */
export function keyed<T extends number | Record<string, number>>(f: number, keys: Key<T>[]): T {
  if (f <= keys[0].f) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f < b.f) {
      const t = (b.ease ?? easeIO)(seg(f, a.f, b.f));
      if (typeof a.v === "number") return lerp(a.v, b.v as number, t) as T;
      const out: Record<string, number> = {};
      for (const k of Object.keys(a.v)) out[k] = lerp((a.v as any)[k], ((b.v as any)[k] ?? (a.v as any)[k]), t);
      return out as T;
    }
  }
  return keys[keys.length - 1].v;
}
