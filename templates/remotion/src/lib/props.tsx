import React from "react";
import { INK, INK_W, INK_W_THIN, PAPER, RED, SHADE, SHADE_DARK } from "./look";
import { Ink, Letters, Shape, blob, smooth } from "./ink";

// Props are line art on paper fill, like the characters. Real-photo cutouts (gym machines, phones,
// app screens) also appear in the reference: drop a PNG in public/ and use <Img> from remotion for those.

/** Bed seen from the side. (x, y) = floor point under the middle. Blanket covers a sleeper lying on it. */
export const Bed: React.FC<{ x: number; y: number; w?: number; blanket?: string; lump?: number; tilt?: number }> = ({ x, y, w = 620, blanket = "#cfd8e6", lump = 1, tilt = 0 }) => {
  const h = 150, top = y - h, hw = w / 2;
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <Shape d={`M${x - hw},${y} L${x - hw},${top - 210} Q${x - hw + 10},${top - 250} ${x - hw + 50},${top - 240} L${x - hw + 50},${top}`} />
      <Shape d={`M${x + hw},${y} L${x + hw},${top - 90} Q${x + hw - 10},${top - 120} ${x + hw - 45},${top - 110} L${x + hw - 45},${top}`} />
      <Shape d={`M${x - hw + 40},${top} L${x + hw - 40},${top} L${x + hw - 40},${top + 60} L${x - hw + 40},${top + 60} Z`} />
      <Ink d={`M${x - hw + 70},${top + 60} L${x - hw + 70},${y} M${x + hw - 70},${top + 60} L${x + hw - 70},${y}`} />
      <Shape d={blob(x - hw + 140, top - 30, 95, 38, 0.05, 2)} fill="#f6efe9" />
      <Shape d={smooth([[x - hw + 170, top + 8], [x - hw + 230, top - 40 - 50 * lump], [x, top - 60 - 40 * lump], [x + hw * 0.5, top - 50 - 25 * lump], [x + hw - 40, top - 30], [x + hw - 10, top + 40], [x - hw + 170, top + 40]], true)} fill={blanket} />
      <Ink d={`M${x - 40},${top - 50} Q${x + 30},${top - 20} ${x + 120},${top - 40}`} w={INK_W_THIN} />
    </g>
  );
};

/** Classic twin-bell alarm clock. ring = 0..1 (bells shake), face shows `label` (e.g. "6:00"). */
export const AlarmClock: React.FC<{ x: number; y: number; s?: number; ring?: number; f?: number; label?: string; broken?: boolean }> = ({ x, y, s = 1, ring = 0, f = 0, label, broken }) => {
  const r = 80, j = ring ? (Math.floor(f / 1) % 2 ? 1 : -1) * 9 * ring : 0;
  if (broken) return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Shape d={`M-90,0 L-60,-40 L-20,-22 L10,-50 L40,-18 L90,-30 L100,0 Z`} fill={RED} />
      <Shape d={blob(-120, -10, 26, 22, 0.1, 5)} fill="#e9e1d8" />
      <Ink d={`M130,-6 q20,-30 40,-4 M-150,-30 l-24,-20`} w={INK_W_THIN} />
      <Shape d={blob(60, -64, 20, 18, 0.1, 6)} fill={RED} />
    </g>
  );
  return (
    <g transform={`translate(${x + j},${y}) scale(${s}) rotate(${j * 0.6})`}>
      <Ink d={`M-50,-10 L-70,25 M50,-10 L70,25`} />
      <Shape d={`M-70,${-r * 2 + 10} A40,40 0 0 1 -10,${-r * 2 - 30} Z`} fill={RED} />
      <Shape d={`M70,${-r * 2 + 10} A40,40 0 0 0 10,${-r * 2 - 30} Z`} fill={RED} />
      <Shape d={blob(0, -r, r, r, 0.02, 4)} fill={RED} />
      <Shape d={blob(0, -r, r * 0.74, r * 0.74, 0.02, 8)} fill="#fbf3ee" />
      {label ? <Letters x={0} y={-r + 18} size={50} text={label} /> : <Ink d={`M0,${-r} L0,${-r - 40} M0,${-r} L28,${-r + 10}`} />}
      {ring > 0 && <g>{[-1, 1].map(sd => <g key={sd}>
        <Ink d={`M${sd * 120},${-r * 2} l${sd * 30},-20 M${sd * 130},${-r * 1.4} l${sd * 40},0 M${sd * 120},${-r * 0.8} l${sd * 30},20`} w={INK_W} />
      </g>)}</g>}
    </g>
  );
};

export const Nightstand: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <Shape d={`M${x - 90},${y} L${x - 90},${y - 190} L${x + 90},${y - 190} L${x + 90},${y} Z`} />
    <Ink d={`M${x - 90},${y - 110} L${x + 90},${y - 110}`} w={INK_W_THIN} />
    <Shape d={blob(x, y - 150, 10, 8, 0.1, 1)} fill={INK} w={1} />
  </g>
);

export const Window: React.FC<{ x: number; y: number; w?: number; h?: number; night?: boolean }> = ({ x, y, w = 260, h = 320, night }) => (
  <g>
    <Shape d={`M${x - w / 2},${y - h / 2} L${x + w / 2},${y - h / 2} L${x + w / 2},${y + h / 2} L${x - w / 2},${y + h / 2} Z`} fill={night ? "#3a4656" : "#cfe3f0"} />
    {night && <Shape d={blob(x + w * 0.2, y - h * 0.22, 26, 26, 0.03, 2)} fill="#f4ecd8" w={INK_W_THIN} />}
    <Ink d={`M${x},${y - h / 2} L${x},${y + h / 2} M${x - w / 2},${y} L${x + w / 2},${y}`} />
  </g>
);

/** Calendar page (the twist label lives here). */
export const Calendar: React.FC<{ x: number; y: number; top?: string; big: string }> = ({ x, y, top = "", big }) => (
  <g>
    <Shape d={`M${x - 90},${y - 110} L${x + 90},${y - 110} L${x + 90},${y + 110} L${x - 90},${y + 110} Z`} fill="#fbf3ee" />
    <Shape d={`M${x - 90},${y - 110} L${x + 90},${y - 110} L${x + 90},${y - 50} L${x - 90},${y - 50} Z`} fill={RED} />
    {top && <Letters x={x} y={y - 64} size={44} text={top} c="#fbf3ee" />}
    <Letters x={x} y={y + 52} size={92} text={big} />
  </g>
);

/** Little house seen from outside at night (for the "through the roof" beat). */
export const House: React.FC<{ x: number; y: number; s?: number; hole?: boolean }> = ({ x, y, s = 1, hole }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Shape d={`M-160,0 L-160,-200 L160,-200 L160,0 Z`} fill={PAPER} />
    <Shape d={`M-200,-190 L0,-360 L200,-190 Z`} fill={RED} />
    {hole && <Shape d={`M-40,-300 L-10,-350 L30,-320 L55,-280 L10,-260 Z`} fill="#2c3c4c" />}
    <Shape d={`M-50,0 L-50,-110 L30,-110 L30,0 Z`} fill="#cfb9ad" />
    <Shape d={`M70,-150 L130,-150 L130,-90 L70,-90 Z`} fill="#f3d98a" />
  </g>
);

export const Moon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 120 }) => (
  <g>
    <Shape d={blob(x, y, r, r, 0.015, 3, 14)} fill="#eadfc8" />
    <Shape d={blob(x - r * 0.3, y - r * 0.2, r * 0.18, r * 0.16, 0.1, 2)} fill="#d6c8ad" w={INK_W_THIN} />
    <Shape d={blob(x + r * 0.35, y + r * 0.25, r * 0.12, r * 0.11, 0.1, 5)} fill="#d6c8ad" w={INK_W_THIN} />
  </g>
);

/**
 * The over-rendered punchline figure. The reference's biggest laughs come from cutting from the
 * simple doodle to an absurdly detailed, shaded, heroic version of the same idea, held 1-2 s.
 * This is our own: the bean, but rendered "too much" — shaded muscles, rim light, cape, stubble.
 */
export const HeroRender: React.FC<{ x: number; y: number; s?: number; f?: number }> = ({ x, y, s = 1, f = 0 }) => {
  const breathe = 1 + Math.sin(f / 9) * 0.006;
  return (
    <g transform={`translate(${x},${y}) scale(${s * breathe},${s})`}>
      <defs>
        <radialGradient id="heroSkin" cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#efe0d6" /><stop offset="0.55" stopColor="#c8b2a6" /><stop offset="1" stopColor="#7d6a62" />
        </radialGradient>
        <linearGradient id="heroCape" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a33a36" /><stop offset="1" stopColor="#4a1817" />
        </linearGradient>
        <linearGradient id="heroPants" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c6460" /><stop offset="1" stopColor="#2e2a29" />
        </linearGradient>
      </defs>
      {/* cape */}
      <path d="M-260,-760 Q-420,-300 -380,40 L380,40 Q420,-300 260,-760 Z" fill="url(#heroCape)" stroke={INK} strokeWidth={INK_W} />
      {/* legs */}
      <path d="M-150,-260 L-190,30 L-40,30 L-10,-200 L20,-200 L50,30 L190,30 L150,-260 Z" fill="url(#heroPants)" stroke={INK} strokeWidth={INK_W} />
      {/* torso: V-taper */}
      <path d="M-300,-700 Q-330,-600 -250,-470 Q-190,-330 -150,-250 L150,-250 Q190,-330 250,-470 Q330,-600 300,-700 Q160,-780 0,-770 Q-160,-780 -300,-700 Z" fill="url(#heroSkin)" stroke={INK} strokeWidth={INK_W + 1} />
      {/* pecs, abs, shading strokes */}
      <path d="M-230,-640 Q-120,-700 -10,-640 Q-20,-560 -120,-540 Q-210,-550 -230,-640 Z" fill="#b39d92" opacity={0.6} />
      <path d="M230,-640 Q120,-700 10,-640 Q20,-560 120,-540 Q210,-550 230,-640 Z" fill="#9a847a" opacity={0.6} />
      <Ink d="M-220,-560 Q-110,-520 -6,-560 M220,-560 Q110,-520 6,-560 M0,-640 L0,-270" w={INK_W - 1} />
      {[-470, -410, -350].map((yy, i) => <Ink key={i} d={`M-80,${yy} Q-40,${yy + 16} -8,${yy} M80,${yy} Q40,${yy + 16} 8,${yy}`} w={INK_W - 2} />)}
      {Array.from({ length: 9 }, (_, i) => <Ink key={"h" + i} d={`M${160 + i * 9},${-620 + i * 30} l40,-26`} w={2.5} op={0.55} />)}
      {/* arms on hips */}
      <path d="M-300,-700 Q-420,-620 -400,-480 Q-380,-380 -250,-330 L-215,-390 Q-300,-430 -300,-520 Z" fill="url(#heroSkin)" stroke={INK} strokeWidth={INK_W} />
      <path d="M300,-700 Q420,-620 400,-480 Q380,-380 250,-330 L215,-390 Q300,-430 300,-520 Z" fill="url(#heroSkin)" stroke={INK} strokeWidth={INK_W} />
      {/* head: still a bean, but chiselled */}
      <path d="M-120,-790 Q-140,-960 0,-990 Q140,-960 120,-790 Q100,-720 0,-715 Q-100,-720 -120,-790 Z" fill="url(#heroSkin)" stroke={INK} strokeWidth={INK_W + 1} />
      <path d="M-100,-800 Q0,-730 100,-800 Q90,-735 0,-718 Q-90,-735 -100,-800 Z" fill="#5b4c46" opacity={0.55} />
      <Ink d="M-78,-880 L-24,-866 M78,-880 L24,-866" w={INK_W + 2} />
      <Shape d="M-66,-858 Q-48,-848 -30,-856 Q-48,-866 -66,-858 Z" fill={INK} w={2} />
      <Shape d="M66,-858 Q48,-848 30,-856 Q48,-866 66,-858 Z" fill={INK} w={2} />
      <Ink d="M-6,-850 L-14,-808 L8,-806 M-40,-776 Q0,-768 40,-776" w={INK_W - 2} />
      <path d="M-120,-800 Q-140,-960 0,-990" stroke="#fffaf6" strokeWidth={5} fill="none" opacity={0.85} />
      <path d="M-300,-700 Q-330,-600 -250,-470" stroke="#fffaf6" strokeWidth={5} fill="none" opacity={0.7} />
      {/* belt */}
      <path d="M-160,-270 L160,-270 L150,-225 L-150,-225 Z" fill={SHADE_DARK} stroke={INK} strokeWidth={INK_W} />
      <Shape d="M-30,-268 L30,-268 L28,-228 L-28,-228 Z" fill="#d9b44a" w={INK_W - 2} />
      <path d="M-380,40 L380,40" stroke={SHADE} strokeWidth={0} />
    </g>
  );
};

export { INK, INK_W };
