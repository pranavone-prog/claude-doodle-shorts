import React from "react";
import { AbsoluteFill } from "remotion";
import { H, PAPER, TITLE, W, INK } from "./look";
import { Letters } from "./ink";
import { Key, keyed, seg } from "./time";

/** One SVG "page" at 1080x1920 with the paper colour. Every scene renders inside a Page. */
export const Page: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg = PAPER, children }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">{children}</svg>
  </AbsoluteFill>
);

export type Cam = { x: number; y: number; z: number; r?: number };
/** Camera = a transform on the world group. (x, y) is the world point at frame centre, z the zoom.
 *  Reference: static most of the time; slow push-ins ~0.1 %/frame; pull-outs to reveal; hard cuts otherwise. */
export const Camera: React.FC<{ f: number; keys: Key<Cam>[]; shake?: { x: number; y: number }; children: React.ReactNode }> = ({ f, keys, shake = { x: 0, y: 0 }, children }) => {
  const c = keyed(f, keys as Key<Record<string, number>>[]) as unknown as Cam;
  const tx = W / 2 - c.x * c.z + shake.x, ty = H / 2 - c.y * c.z + shake.y;
  return <g transform={`translate(${tx},${ty}) scale(${c.z}) rotate(${c.r ?? 0} ${c.x} ${c.y})`}>{children}</g>;
};
/** Shorthand: a still camera framing the whole page. */
export const still = (z = 1, x = W / 2, y = H / 2): Key<Cam>[] => [{ f: 0, v: { x, y, z, r: 0 } }];
/** Slow push-in from z0 to z1 over the shot (the reference's "creep"). */
export const push = (dur: number, z0 = 1, z1 = 1.08, x = W / 2, y = H / 2): Key<Cam>[] => [
  { f: 0, v: { x, y, z: z0, r: 0 } }, { f: dur, v: { x, y, z: z1, r: 0 }, ease: (t: number) => t },
];

/** The top title band ("A VS. B", "HOW IT FEELS ...", "B:"). Fades in over `fade` frames if asked. */
export const Title: React.FC<{ lines: string[]; f: number; fade?: number; c?: string }> = ({ lines, f, fade = 0, c = INK }) => {
  const op = fade ? seg(f, 0, fade) : 1;
  return <g>{lines.map((l, i) => (
    <Letters key={i} x={W / 2} y={H * TITLE.y + i * TITLE.size * TITLE.lineGap} size={TITLE.size} text={l.toUpperCase()} c={c} op={op} />
  ))}</g>;
};

/** Your own small handle, like a signature near the subject (optional). Never use someone else's. */
export const Handle: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <Letters x={x} y={y} size={30} text={text} c="#8d7a72" anchor="start" spacing={0} />
);
