import React from "react";
import { INK, INK_W, INK_W_THIN, PAPER, RED } from "./look";
import { Ink, Shape, Tube, blob, smooth, P } from "./ink";

// A doodle "bean" character. Local coords: feet on y = 0, up is negative, ~400 units tall at scale 1.
// Measured proportions (reference): big round head ~40 % of height, tiny torso, outlined noodle limbs,
// mitten hands, paper-coloured fill (characters are the SAME colour as the paper), 6 px warm-black ink.

export type Pose = {
  lean?: number;      // body lean, degrees (+ = right)
  tilt?: number;      // head tilt, degrees
  armL?: [number, number]; armR?: [number, number];   // [shoulder°, elbow°]; 0 = hanging straight down, + = outward/up
  legL?: [number, number]; legR?: [number, number];   // [hip°, knee°]; 0 = straight down, + = outward
  squash?: number;    // 1 = normal, <1 squashed, >1 stretched
  buff?: number;      // 0 = noodle, 1 = swole (thicker limbs, wide torso)
  sit?: number;       // 0..1 lowers the hips (sitting / crouching)
};
export type Face =
  | "neutral" | "happy" | "angry" | "strain" | "shock" | "sleep" | "smug"
  | "cry" | "dead" | "blank" | "scream" | "determined";
export type Hat = "none" | "beanie" | "cap" | "headband" | "nightcap";

const R = 78; // head radius
const deg = (d: number) => (d * Math.PI) / 180;

function limb(ox: number, oy: number, a1: number, a2: number, l1: number, l2: number, side: -1 | 1): P[] {
  // angle 0 = straight down; side flips outward direction
  const t1 = deg(a1) * side, t2 = deg(a1 + a2) * side;
  const k: P = [ox + Math.sin(t1) * l1, oy + Math.cos(t1) * l1];
  const e: P = [k[0] + Math.sin(t2) * l2, k[1] + Math.cos(t2) * l2];
  return [[ox, oy], k, e];
}

export const FaceArt: React.FC<{ face: Face; look?: number; blink?: boolean }> = ({ face, look = 0, blink }) => {
  const ex = R * 0.34, ey = -R * 0.02, lx = look * R * 0.08;
  const w = INK_W_THIN + 1;
  const dot = (x: number) => <Shape d={blob(x + lx, ey, R * 0.075, R * 0.09, 0.02, x)} fill={INK} w={1} />;
  const closed = (x: number) => <Ink d={`M${x - R * 0.13},${ey} Q${x},${ey + R * 0.11} ${x + R * 0.13},${ey}`} w={w} />;
  const eyes = (() => {
    if (blink && !["sleep", "cry", "dead", "strain", "happy"].includes(face)) return <>{closed(-ex)}{closed(ex)}</>;
    switch (face) {
      case "happy": return <>{[-ex, ex].map(x => <Ink key={x} d={`M${x - R * 0.13},${ey + R * 0.04} Q${x},${ey - R * 0.12} ${x + R * 0.13},${ey + R * 0.04}`} w={w} />)}</>;
      case "angry": case "determined": return <>{dot(-ex)}{dot(ex)}
        <Ink d={`M${-ex - R * 0.2},${ey - R * 0.26} L${-ex + R * 0.16},${ey - R * 0.12}`} w={w + 1} />
        <Ink d={`M${ex + R * 0.2},${ey - R * 0.26} L${ex - R * 0.16},${ey - R * 0.12}`} w={w + 1} /></>;
      case "strain": return <>
        <Ink d={`M${-ex - R * 0.14},${ey - R * 0.1} L${-ex + R * 0.1},${ey} L${-ex - R * 0.14},${ey + R * 0.1}`} w={w} />
        <Ink d={`M${ex + R * 0.14},${ey - R * 0.1} L${ex - R * 0.1},${ey} L${ex + R * 0.14},${ey + R * 0.1}`} w={w} /></>;
      case "shock": case "scream": return <>{[-ex, ex].map(x => <g key={x}>
        <Shape d={blob(x, ey - R * 0.04, R * 0.2, R * 0.24, 0.03, x + 3)} fill="#fbf3ee" w={w} />
        <Shape d={blob(x + lx, ey - R * 0.02, R * 0.04, R * 0.05, 0, x)} fill={INK} w={1} /></g>)}</>;
      case "sleep": case "cry": return <>{closed(-ex)}{closed(ex)}</>;
      case "smug": return <>{[-ex, ex].map(x => <g key={x}>
        <Ink d={`M${x - R * 0.16},${ey - R * 0.02} L${x + R * 0.16},${ey - R * 0.02}`} w={w} />
        <Shape d={`M${x - R * 0.1 + lx},${ey} A${R * 0.08},${R * 0.08} 0 0 0 ${x + R * 0.1 + lx},${ey} Z`} fill={INK} w={1} /></g>)}</>;
      case "dead": return <>{[-ex, ex].map(x => <g key={x}>
        <Ink d={`M${x - R * 0.12},${ey - R * 0.12} L${x + R * 0.12},${ey + R * 0.12} M${x + R * 0.12},${ey - R * 0.12} L${x - R * 0.12},${ey + R * 0.12}`} w={w} /></g>)}</>;
      case "blank": return <>{[-ex, ex].map(x => <g key={x}>
        <Shape d={blob(x, ey, R * 0.2, R * 0.12, 0.02, x)} fill="#fbf3ee" w={w} />
        <Ink d={`M${x - R * 0.2},${ey} L${x + R * 0.2},${ey}`} w={w - 1} /></g>)}</>;
      default: return <>{dot(-ex)}{dot(ex)}</>;
    }
  })();
  const my = R * 0.42;
  const mouth = (() => {
    switch (face) {
      case "happy": return <Shape d={`M${-R * 0.24},${my - R * 0.06} Q0,${my + R * 0.34} ${R * 0.24},${my - R * 0.06} Z`} fill="#6b2a26" w={w} />;
      case "angry": case "strain": return <g>
        <Shape d={`M${-R * 0.26},${my - R * 0.06} L${R * 0.26},${my - R * 0.06} L${R * 0.22},${my + R * 0.12} L${-R * 0.22},${my + R * 0.12} Z`} fill="#fbf3ee" w={w} />
        <Ink d={`M${-R * 0.24},${my + R * 0.03} L${R * 0.24},${my + R * 0.03} M${-R * 0.08},${my - R * 0.06} L${-R * 0.08},${my + R * 0.12} M${R * 0.08},${my - R * 0.06} L${R * 0.08},${my + R * 0.12}`} w={INK_W_THIN - 1} /></g>;
      case "shock": return <Shape d={blob(0, my + R * 0.02, R * 0.09, R * 0.13, 0.03, 9)} fill="#6b2a26" w={w} />;
      case "scream": return <Shape d={blob(0, my + R * 0.06, R * 0.2, R * 0.28, 0.06, 4)} fill="#6b2a26" w={w} />;
      case "sleep": return <Shape d={blob(R * 0.05, my, R * 0.06, R * 0.08, 0.03, 2)} fill="#6b2a26" w={w - 1} />;
      case "smug": return <Ink d={`M${-R * 0.16},${my} Q${R * 0.05},${my + R * 0.08} ${R * 0.22},${my - R * 0.1}`} w={w} />;
      case "cry": return <Ink d={smooth([[-R * 0.22, my + R * 0.08], [-R * 0.1, my - R * 0.02], [0, my + R * 0.06], [R * 0.1, my - R * 0.02], [R * 0.22, my + R * 0.08]])} w={w} />;
      case "dead": case "blank": return <Ink d={`M${-R * 0.14},${my} L${R * 0.14},${my}`} w={w} />;
      case "determined": return <Ink d={`M${-R * 0.18},${my + R * 0.02} Q0,${my - R * 0.06} ${R * 0.18},${my + R * 0.02}`} w={w} />;
      default: return <Ink d={`M${-R * 0.1},${my} Q0,${my + R * 0.06} ${R * 0.1},${my}`} w={w} />;
    }
  })();
  const tears = face === "cry" ? <>
    <Ink d={`M${-ex},${ey + R * 0.08} Q${-ex - R * 0.06},${ey + R * 0.5} ${-ex + R * 0.02},${ey + R * 0.75}`} w={w + 4} c="#4f74b8" />
    <Ink d={`M${ex},${ey + R * 0.08} Q${ex + R * 0.06},${ey + R * 0.5} ${ex - R * 0.02},${ey + R * 0.75}`} w={w + 4} c="#4f74b8" /></> : null;
  return <g>{eyes}{mouth}{tears}</g>;
};

const HatArt: React.FC<{ hat: Hat; colour: string }> = ({ hat, colour }) => {
  switch (hat) {
    case "beanie": return <g>
      <Shape d={`M${-R * 0.98},${-R * 0.3} Q${-R * 0.9},${-R * 1.25} 0,${-R * 1.22} Q${R * 0.9},${-R * 1.25} ${R * 0.98},${-R * 0.3} Z`} fill={colour} />
      <Shape d={`M${-R * 1.02},${-R * 0.42} L${R * 1.02},${-R * 0.42} L${R}, ${-R * 0.18} L${-R},${-R * 0.18} Z`} fill={colour} />
      <Shape d={blob(0, -R * 1.28, R * 0.18, R * 0.16, 0.05, 3)} fill={colour} /></g>;
    case "cap": return <g>
      <Shape d={`M${-R * 0.95},${-R * 0.35} Q${-R * 0.8},${-R * 1.15} 0,${-R * 1.12} Q${R * 0.8},${-R * 1.15} ${R * 0.95},${-R * 0.35} Z`} fill={colour} />
      <Shape d={`M${R * 0.3},${-R * 0.42} Q${R * 1.2},${-R * 0.5} ${R * 1.5},${-R * 0.28} L${R * 0.9},${-R * 0.25} Z`} fill={colour} /></g>;
    case "headband": return <Shape d={`M${-R * 0.99},${-R * 0.5} Q0,${-R * 0.66} ${R * 0.99},${-R * 0.5} L${R * 0.97},${-R * 0.3} Q0,${-R * 0.46} ${-R * 0.97},${-R * 0.3} Z`} fill={colour} />;
    case "nightcap": return <g>
      <Shape d={`M${-R * 0.95},${-R * 0.35} Q${-R * 0.6},${-R * 1.3} ${R * 0.3},${-R * 1.2} Q${R * 1.3},${-R * 1.1} ${R * 1.6},${-R * 0.4} Q${R * 0.9},${-R * 0.8} ${R * 0.95},${-R * 0.35} Z`} fill={colour} />
      <Shape d={blob(R * 1.62, -R * 0.32, R * 0.16, R * 0.16, 0.05, 2)} fill={PAPER} /></g>;
    default: return null;
  }
};

export type BeanProps = {
  x: number; y: number; s?: number; flip?: boolean;
  pose?: Pose; face?: Face; look?: number; blink?: boolean;
  hat?: Hat; hatColour?: string; fill?: string;
  /** extra drawing in hand space: rendered at the right hand */
  holdR?: React.ReactNode; holdL?: React.ReactNode;
};

export const Bean: React.FC<BeanProps> = ({ x, y, s = 1, flip, pose = {}, face = "neutral", look, blink, hat = "none", hatColour = RED, fill = PAPER, holdR, holdL }) => {
  const { lean = 0, tilt = 0, armL = [12, 0], armR = [12, 0], legL = [8, 0], legR = [8, 0], squash = 1, buff = 0, sit = 0 } = pose;
  const legLen = 62 * (1 - sit * 0.55);
  const hipY = -legLen * 2 - 6;
  const torsoH = 120 * squash, tw = 46 + buff * 70;
  const shY = hipY - torsoH + 22;
  const headY = hipY - torsoH - R + 18;
  const limbT = 17 + buff * 26, armL1 = 70, armL2 = 66;
  const aL = limb(-tw * 0.62, shY, armL[0], armL[1], armL1, armL2, -1);
  const aR = limb(tw * 0.62, shY, armR[0], armR[1], armL1, armL2, 1);
  const lL = limb(-tw * 0.35, hipY, legL[0], legL[1] + sit * 70, legLen, legLen, -1);
  const lR = limb(tw * 0.35, hipY, legR[0], legR[1] + sit * 70, legLen, legLen, 1);
  const torso = buff > 0.3
    ? smooth([[-tw * 0.55, hipY + 6], [-tw * 0.85, shY + 30], [-tw * 1.05, shY - 6], [-tw * 0.5, shY - 22], [0, shY - 18], [tw * 0.5, shY - 22], [tw * 1.05, shY - 6], [tw * 0.85, shY + 30], [tw * 0.55, hipY + 6]], true)
    : blob(0, (hipY + shY) / 2 - 6, tw * 0.62, torsoH * 0.55, 0.02, 7, 8);
  const foot = (p: P, side: number) => <Shape key={side} d={blob(p[0] + side * 14, p[1] - 6, 26, 14, 0.04, side + 4)} fill={fill} />;
  const hand = (p: P, side: number, held?: React.ReactNode) => (
    <g key={side} transform={`translate(${p[0]},${p[1]})`}>
      {held}
      <Shape d={blob(0, 0, 18 + buff * 8, 17 + buff * 8, 0.08, side * 3)} fill={fill} />
      <Ink d={`M${side * 6},${-10} Q${side * 20},${-22} ${side * 24},${-8}`} w={INK_W_THIN} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${lean} 0 ${hipY})`}>
      {/* legs + feet behind torso */}
      <Tube pts={lL} thick={limbT} fill={fill} /><Tube pts={lR} thick={limbT} fill={fill} />
      {foot(lL[2], -1)}{foot(lR[2], 1)}
      <Shape d={torso} fill={fill} />
      {buff > 0.3 && <Ink d={`M0,${shY + 6} L0,${shY + 50} M${-tw * 0.5},${shY + 44} Q${-tw * 0.25},${shY + 58} 0,${shY + 46} Q${tw * 0.25},${shY + 58} ${tw * 0.5},${shY + 44}`} w={INK_W_THIN} />}
      <Tube pts={aL} thick={limbT} fill={fill} /><Tube pts={aR} thick={limbT} fill={fill} />
      {hand(aL[2], -1, holdL)}{hand(aR[2], 1, holdR)}
      <g transform={`translate(0,${headY}) rotate(${tilt})`}>
        <Shape d={blob(0, 0, R, R * 1.02, 0.025, 11, 12)} fill={fill} />
        <FaceArt face={face} look={look} blink={blink} />
        <HatArt hat={hat} colour={hatColour} />
      </g>
    </g>
  );
};

/** Just the head (for a sleeper on a pillow, peeking out, close-ups). (x, y) = head centre. */
export const Head: React.FC<{ x: number; y: number; s?: number; rot?: number; face?: Face; look?: number; blink?: boolean; hat?: Hat; hatColour?: string; fill?: string }> = ({ x, y, s = 1, rot = 0, face = "neutral", look, blink, hat = "none", hatColour = RED, fill = PAPER }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <Shape d={blob(0, 0, R, R * 1.02, 0.025, 11, 12)} fill={fill} />
    <FaceArt face={face} look={look} blink={blink} />
    <HatArt hat={hat} colour={hatColour} />
  </g>
);

/** Where the head centre is in world space (for fx like Zs, sweat, anger marks). */
export const headPos = (x: number, y: number, s = 1, pose: Pose = {}) => {
  const sit = pose.sit ?? 0, squash = pose.squash ?? 1;
  const legLen = 62 * (1 - sit * 0.55), hipY = -legLen * 2 - 6, torsoH = 120 * squash;
  return { x, y: y + (hipY - torsoH - R + 18) * s, r: R * s };
};

/** Simple blink schedule: blink for 3 frames every ~2-3 s (seeded per character). */
export const blinkAt = (f: number, seed = 0) => {
  const period = 52 + Math.round(((Math.sin(seed * 9.1) + 1) / 2) * 20);
  return (f + seed * 13) % period < 3;
};

export { INK, INK_W };
