import React from "react";
import { GLOW, GLOW_CORE, INK, INK_W, INK_W_THIN, PAPER, W, H } from "./look";
import { Ink, Letters, Shape, blob, smooth } from "./ink";
import { easeOut, onN, rnd, seg } from "./time";

/** "Z z z" floating up from a sleeper. f = frames since start. */
export const Zs: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>{[0, 1, 2].map(i => {
    const t = ((onN(f, 2) + i * 16) % 48) / 48;
    return <Letters key={i} x={x + 40 * t + i * 8} y={y - 160 * t} size={46 + 24 * (1 - t)} text="Z" op={1 - t} />;
  })}</g>
);

/** Little arcs next to a head = trembling / shock ("( )" marks). */
export const Tremble: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => {
  const j = onN(f, 2) % 4 < 2 ? 0 : 4;
  return <g>{[-1, 1].map(s => <g key={s}>
    <Ink d={`M${x + s * (r + 30 + j)},${y - 30} q${s * 14},30 0,60`} w={INK_W_THIN} />
    <Ink d={`M${x + s * (r + 60 + j)},${y - 50} q${s * 18},50 0,100`} w={INK_W_THIN} />
  </g>)}</g>;
};

/** Sweat drops flicking off a head. */
export const Sweat: React.FC<{ x: number; y: number; r: number; f: number; n?: number }> = ({ x, y, r, f, n = 3 }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const t = ((onN(f, 2) + i * 9) % 20) / 20, s = i % 2 ? 1 : -1;
    const px = x + s * (r * 0.9 + 60 * t), py = y - r * 0.6 - 40 * Math.sin(t * Math.PI) + 60 * t * t;
    return <Shape key={i} d={`M${px},${py - 26} Q${px + 16},${py} ${px},${py + 8} Q${px - 16},${py} ${px},${py - 26} Z`} fill="#bfe3f2" w={INK_W_THIN} op={1 - t * 0.6} />;
  })}</g>
);

/** Anger cross-vein mark. */
export const Vein: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => {
  const k = 1 + (onN(f, 3) % 6 < 3 ? 0.12 : 0);
  return <g transform={`translate(${x},${y}) scale(${s * k})`}>
    {[0, 90, 180, 270].map(a => <Ink key={a} d={`M8,-8 Q24,-6 28,-22`} w={INK_W} c="#b8433f" />).map((el, i) =>
      <g key={i} transform={`rotate(${i * 90})`}>{el}</g>)}
  </g>;
};

/** Motion streaks behind something moving: lines trailing opposite to (dx, dy). */
export const Streaks: React.FC<{ x: number; y: number; dx: number; dy: number; len?: number; n?: number; spread?: number; c?: string }> = ({ x, y, dx, dy, len = 220, n = 5, spread = 140, c = INK }) => {
  const m = Math.hypot(dx, dy) || 1, ux = -dx / m, uy = -dy / m, px = -uy, py = ux;
  return <g>{Array.from({ length: n }, (_, i) => {
    const o = (i / (n - 1) - 0.5) * spread, l = len * (0.6 + rnd(i * 3.3) * 0.5);
    const sx = x + px * o + ux * 40, sy = y + py * o + uy * 40;
    return <Ink key={i} d={`M${sx},${sy} L${sx + ux * l},${sy + uy * l}`} w={INK_W_THIN} c={c} />;
  })}</g>;
};

/** Full-frame impact / "aura" frame: radial speed lines. Reference: black field with white lines
 *  (or paper field with ink lines) held 2-4 frames on the biggest hit. */
export const SpeedBurst: React.FC<{ f: number; dark?: boolean; cx?: number; cy?: number; inner?: number }> = ({ f, dark = true, cx = W / 2, cy = H * 0.45, inner = 260 }) => {
  const seed = onN(f, 2);
  const line = dark ? "#f4f1ee" : INK;
  return <g>
    {dark && <rect x={0} y={0} width={W} height={H} fill="#0c0a0a" />}
    {Array.from({ length: 64 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2 + rnd(seed + i) * 0.08;
      const r0 = inner + rnd(seed * 3 + i) * 200, r1 = 1800;
      const w = 3 + rnd(seed + i * 7) * 10;
      const ca = Math.cos(a), sa = Math.sin(a), pa = w / 2;
      return <path key={i} d={`M${cx + ca * r0},${cy + sa * r0} L${cx + ca * r1 - sa * pa * 6},${cy + sa * r1 + ca * pa * 6} L${cx + ca * r1 + sa * pa * 6},${cy + sa * r1 - ca * pa * 6} Z`} fill={line} />;
    })}
  </g>;
};

/** Power-up aura: flickering cyan flame outline + white core (reference escalation beats). */
export const Aura: React.FC<{ x: number; y: number; h: number; w: number; f: number }> = ({ x, y, h, w, f }) => {
  const s = onN(f, 2);
  const pts = (k: number, sc: number) => Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2, top = Math.sin(a) < 0 ? 1 + rnd(s + i + k) * 0.6 : 1;
    return [x + Math.cos(a) * w * sc * (0.9 + rnd(s * 2 + i + k) * 0.2), y - h / 2 + Math.sin(a) * h / 2 * sc * top] as [number, number];
  });
  return <g>
    <path d={smooth(pts(1, 1.15), true)} fill="none" stroke={GLOW} strokeWidth={14} opacity={0.9} />
    <path d={smooth(pts(2, 1.0), true)} fill={GLOW} opacity={0.22} />
  </g>;
};

/** Debris / crumbs flying out ballistically from (x,y), starting at frame 0 of f. */
export const Debris: React.FC<{ x: number; y: number; f: number; n?: number; power?: number; c?: string; seed?: number }> = ({ x, y, f, n = 14, power = 26, c = PAPER, seed = 1 }) => {
  const t = onN(f, 2);
  return <g>{Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (rnd(seed + i) - 0.5) * 2.6, v = power * (0.5 + rnd(seed + i * 2));
    const px = x + Math.cos(a) * v * t, py = y + Math.sin(a) * v * t + 0.9 * t * t;
    const sz = 10 + rnd(seed + i * 5) * 22;
    return <Shape key={i} d={`M${px - sz},${py} L${px},${py - sz * 0.8} L${px + sz * 0.9},${py + sz * 0.2} L${px - sz * 0.2},${py + sz * 0.7} Z`}
      fill={c} w={INK_W_THIN} />;
  })}</g>;
};

/** Pop-in scale for a new element: 0 -> overshoot -> 1 over `d` frames. */
export const popScale = (f: number, d = 6) => {
  const t = seg(f, 0, d);
  return t >= 1 ? 1 : easeOut(t) * (1 + 0.25 * Math.sin(t * Math.PI));
};

/** Simple white flash over the frame for `d` frames. */
export const Flash: React.FC<{ f: number; d?: number; c?: string }> = ({ f, d = 4, c = "#ffffff" }) =>
  f >= 0 && f < d ? <rect x={0} y={0} width={W} height={H} fill={c} opacity={1 - f / d} /> : null;

/** Stars for the night / space backgrounds (twinkle on 3s). */
export const Stars: React.FC<{ f: number; n?: number; seed?: number }> = ({ f, n = 40, seed = 3 }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const x = rnd(seed + i) * W, y = rnd(seed + i * 4.1) * H, tw = (onN(f, 3) + i * 5) % 30 < 4;
    const r = 3 + rnd(seed + i * 2) * 5 + (tw ? 3 : 0);
    return <path key={i} d={`M${x - r},${y} L${x + r},${y} M${x},${y - r} L${x},${y + r}`} stroke="#f4f1ee" strokeWidth={2.5} strokeLinecap="round" />;
  })}</g>
);

export const Ground: React.FC<{ y: number; x0?: number; x1?: number }> = ({ y, x0 = -40, x1 = W + 40 }) => {
  const pts: Array<[number, number]> = [[x0, y + 2], [W * 0.3, y - 2], [W * 0.6, y + 3], [x1, y]];
  return <Ink d={smooth(pts)} w={INK_W} />;
};

export { blob };
