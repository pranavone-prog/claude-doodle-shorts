import React from "react";
import { loadFont } from "@remotion/google-fonts/PatrickHand";
import { INK, INK_W, PAPER } from "./look";
import { rnd } from "./time";

export const { fontFamily: HAND } = loadFont();

export type P = [number, number];

/** Smooth path through points (Catmull-Rom -> cubic Bézier). Optional jitter = hand-drawn wobble. */
export function smooth(pts: P[], closed = false, jitter = 0, seed = 0): string {
  const p = pts.map(([x, y], i) => [x + (rnd(seed + i * 1.3) - 0.5) * jitter, y + (rnd(seed + i * 2.9 + 5) - 0.5) * jitter] as P);
  if (p.length < 2) return "";
  const n = p.length, at = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
}

/** Ellipse as a slightly imperfect hand-drawn loop (not a perfect SVG circle). */
export function blob(cx: number, cy: number, rx: number, ry: number, wob = 0.03, seed = 0, n = 10): string {
  const pts: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, k = 1 + (rnd(seed + i) - 0.5) * 2 * wob;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts, true);
}

type StrokeProps = { d: string; w?: number; c?: string; fill?: string; op?: number; dash?: string };
/** An ink stroke with round caps — the only line primitive scenes should use. */
export const Ink: React.FC<StrokeProps> = ({ d, w = INK_W, c = INK, fill = "none", op = 1, dash }) => (
  <path d={d} stroke={c} strokeWidth={w} fill={fill} strokeLinecap="round" strokeLinejoin="round" opacity={op} strokeDasharray={dash} />
);

/** A filled, outlined shape (paper fill by default, so it hides what is behind it). */
export const Shape: React.FC<StrokeProps> = ({ d, w = INK_W, c = INK, fill = PAPER, op = 1 }) => (
  <path d={d} stroke={c} strokeWidth={w} fill={fill} strokeLinejoin="round" opacity={op} />
);

/** Outlined noodle limb: ink stroke underneath, fill stroke on top (reference arms/legs are outlined tubes). */
export const Tube: React.FC<{ pts: P[]; thick: number; fill?: string; w?: number }> = ({ pts, thick, fill = PAPER, w = INK_W }) => {
  const d = smooth(pts);
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={thick + w * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={fill} strokeWidth={thick} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** Hand-lettered text (all caps in the reference). */
export const Letters: React.FC<{ x: number; y: number; size: number; text: string; c?: string; anchor?: "start" | "middle" | "end"; op?: number; rot?: number; spacing?: number }> = ({
  x, y, size, text, c = INK, anchor = "middle", op = 1, rot = 0, spacing = 0.02,
}) => (
  <text x={x} y={y} fontFamily={HAND} fontSize={size} fill={c} textAnchor={anchor} opacity={op}
    letterSpacing={`${spacing}em`} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
    {text}
  </text>
);

/** Wrap children in an SVG filter that "boils" the line (changes only every n frames). Use sparingly:
 *  the reference holds most drawings perfectly still; boil is for nervous/cold/rage beats. */
export const Boil: React.FC<{ id: string; frame: number; amt?: number; n?: number; children: React.ReactNode }> = ({ id, frame, amt = 3, n = 2, children }) => {
  const seed = Math.floor(frame / n);
  return (
    <g>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={amt} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  );
};
