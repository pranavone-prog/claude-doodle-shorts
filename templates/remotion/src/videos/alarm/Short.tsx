import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Bean, Head, blinkAt, headPos } from "../../lib/doodle";
import { Aura, Debris, Flash, Ground, SpeedBurst, Stars, Streaks, Sweat, Tremble, Zs, popScale } from "../../lib/fx";
import { Cam, Camera, Handle, Page, Title, push } from "../../lib/frame";
import { Tube } from "../../lib/ink";
import { NIGHT, PAPER, SPACE, W } from "../../lib/look";
import { AlarmClock, Bed, Calendar, HeroRender, House, Moon, Nightstand, Window } from "../../lib/props";
import { Key, easeIn, easeOut, kick, kicks, lerp, onN, seg, vibrate } from "../../lib/time";
import { MUSIC, SFX, SHOTS, shot } from "./story";

const FLOOR = 1380;
const TITLE_A = ["MONDAY VS.", "FRIDAY ALARMS"];
const HANDLE = "@yourhandle"; // put YOUR handle here (or remove <Handle/>)

/** The bedroom set, shared by A, B and C. */
const Bedroom: React.FC<{ f: number; day: "MON" | "FRI" | "SAT"; ring?: number; broken?: boolean; lump?: number; bedTilt?: number; clockLabel?: string; children?: React.ReactNode; under?: React.ReactNode }> = ({ f, day, ring = 0, broken, lump = 1, bedTilt = 0, children, under }) => (
  <g>
    <Window x={790} y={860} night={false} />
    <Calendar x={300} y={850} top="NOV" big={day} />
    <Ground y={FLOOR} />
    <Nightstand x={150} y={FLOOR} />
    <AlarmClock x={150} y={FLOOR - 190} s={0.72} ring={ring} f={f} broken={broken} />
    {under}
    <Bed x={600} y={FLOOR} w={640} lump={lump} tilt={bedTilt} />
    {children}
  </g>
);
const PILLOW = { x: 418, y: 1150 };
// ONE continuous camera track for every bedroom beat (absolute frames). The reference rarely hard-cuts
// (~8 cuts/min, median shot 4.3 s): the camera GLIDES into the next moment instead. Shots only read a window of it.
const WIDE = { x: W / 2, y: 1110, z: 1.12, r: 0 };
const CU = { x: PILLOW.x + 10, y: PILLOW.y - 20, z: 2.5, r: 0 };
const BED_CAM: Key<Cam>[] = [
  { f: 0, v: WIDE }, { f: 84, v: WIDE },
  { f: 102, v: CU }, { f: 132, v: { ...CU, z: 2.62 }, ease: (t: number) => t },
  { f: 140, v: { x: 360, y: 1160, z: 1.18, r: 0 } }, { f: 164, v: { x: 360, y: 1160, z: 1.18, r: 0 } },
  { f: 196, v: WIDE }, { f: 226, v: WIDE },
  { f: 231, v: CU }, { f: 240, v: CU },
  { f: 247, v: { x: W / 2, y: 1080, z: 1.0, r: 0 } }, { f: 262, v: { x: W / 2, y: 1080, z: 1.0, r: 0 } },
  { f: 268, v: { x: 540, y: 1150, z: 1.12, r: 0 } }, { f: 304, v: { x: 540, y: 1150, z: 1.12, r: 0 } },
];
const TWIST_CAM: Key<Cam>[] = [
  { f: 404, v: { x: 300, y: 860, z: 2.3, r: 0 } }, { f: 444, v: { x: 300, y: 860, z: 2.3, r: 0 } },
  { f: 450, v: { x: 400, y: 1140, z: 1.25, r: 0 } }, { f: 504, v: WIDE, ease: (t: number) => t },
];
/** The track re-based to a shot that starts at absolute frame a. */
const track = (keys: Key<Cam>[], a: number): Key<Cam>[] => keys.map(k => ({ ...k, f: k.f - a }));

const Sleeper: React.FC<{ f: number; face?: "sleep" | "blank" | "shock" | "determined"; seed?: number }> = ({ f, face = "sleep", seed = 1 }) => (
  <>
    <Head x={PILLOW.x} y={PILLOW.y} s={0.95} rot={-72} face={face} blink={face === "blank" ? false : blinkAt(f, seed)} hat="nightcap" hatColour="#9fb3cf" />
  </>
);

// ---------------- segment A ----------------
const A_wide: React.FC = () => {
  const f = useCurrentFrame();
  return <Page><Camera f={f} keys={track(BED_CAM, 0)}>
    <Bedroom f={f} day="MON"><Sleeper f={f} /><Zs x={470} y={1010} f={f} /></Bedroom>
  </Camera><Title lines={TITLE_A} f={f} /><Handle x={720} y={1460} text={HANDLE} /></Page>;
};
const A_ring: React.FC = () => {
  const f = useCurrentFrame();
  return <Page><Camera f={f} keys={track(BED_CAM, 66)} shake={{ x: kick(f, 0, 14, 6), y: 0 }}>
    <Bedroom f={f} day="MON" ring={1}><Sleeper f={f} /><Zs x={470} y={1010} f={f + 66} /></Bedroom>
  </Camera><Title lines={TITLE_A} f={f} /></Page>;
};
const A_eye: React.FC = () => {
  const f = useCurrentFrame();
  return <Page><Camera f={f} keys={track(BED_CAM, 96)}>
    <Bedroom f={f} day="MON" ring={1}><Sleeper f={f} face="blank" /></Bedroom>
  </Camera></Page>;
};
const A_smash: React.FC = () => {
  const f = useCurrentFrame();
  // arm crawls out of the blanket (on twos), hovers, then SLAMS on frame 15 (sound at 147 = 15 here)
  const up = easeOut(seg(onN(f), 0, 12));
  const slam = easeIn(seg(f, 13, 15));
  const hx = lerp(lerp(520, 210, up), 160, slam), hy = lerp(lerp(1180, 930, up), 1110, slam);
  const hit = f >= 15;
  return <Page><Camera f={f} keys={track(BED_CAM, 132)} shake={{ x: 0, y: kick(f, 15, 26, 7) }}>
    <Bedroom f={f} day="MON" ring={hit ? 0 : 1} broken={hit}
      under={<Tube pts={[[540, 1215], [lerp(540, 380, up), lerp(1215, 1020, up) + slam * 40], [hx, hy]]} thick={22} />}>
      <Sleeper f={f} face="blank" />
    </Bedroom>
    {hit && <Debris x={160} y={FLOOR - 200} f={f - 15} n={10} power={20} c="#b8433f" />}
    {hit && <Streaks x={hx} y={hy - 40} dx={0} dy={1} len={140} n={4} spread={120} />}
  </Camera></Page>;
};
const A_back: React.FC = () => {
  const f = useCurrentFrame();
  return <Page><Camera f={f} keys={track(BED_CAM, 162)}>
    <Bedroom f={f} day="MON" broken><Sleeper f={f} /><Zs x={470} y={1010} f={f} /></Bedroom>
  </Camera></Page>;
};

// ---------------- segment B ----------------
const B_card: React.FC = () => {
  const f = useCurrentFrame();
  return <Page><Camera f={f} keys={track(BED_CAM, 204)}>
    <Bedroom f={f} day="FRI"><Sleeper f={f} /><Zs x={470} y={1010} f={f} /></Bedroom>
  </Camera><Title lines={["FRIDAY:"]} f={f} fade={8} /></Page>;
};
const B_ring: React.FC = () => {
  const f = useCurrentFrame();
  return <Page><Camera f={f} keys={track(BED_CAM, 228)} shake={{ x: kick(f, 1, 22, 6), y: 0 }}>
    <Bedroom f={f} day="FRI" ring={1}><Sleeper f={f} face={f < 1 ? "sleep" : "shock"} /></Bedroom>
    {f >= 1 && <Tremble x={PILLOW.x} y={PILLOW.y} r={75} f={f} />}
  </Camera></Page>;
};
const B_launch: React.FC = () => {
  const f = useCurrentFrame();
  const rising = f < 10;
  const by = rising ? lerp(1240, -300, easeIn(seg(f, 0, 8))) : lerp(-120, FLOOR, seg(f, 10, 22));
  const bx = rising ? 560 : 540;
  return <Page><Camera f={f} keys={track(BED_CAM, 240)} shake={{ x: kicks(f, [[0, 20, 7]]), y: 0 }}>
    <Bedroom f={f} day="FRI" ring={1} lump={0} bedTilt={f > 1 ? -6 : 0}>
      <Streaks x={bx} y={rising ? by + 40 : by - 420} dx={0} dy={rising ? -1 : 1} len={360} n={6} spread={200} />
      <Bean x={bx} y={by} s={1.1} face="determined" pose={{ armL: [160, 10], armR: [160, 10], legL: [4, 0], legR: [4, 0], squash: 1.25 }} hat="nightcap" hatColour="#9fb3cf" />
    </Bedroom>
  </Camera><Title lines={["FRIDAY:"]} f={f} /></Page>;
};
const B_flex: React.FC = () => {
  const f = useCurrentFrame();
  const land = f < 3;
  const buff = onN(f, 2) < 8 ? 0 : popScale(onN(f, 2) - 8, 8);
  const v = f > 10 ? vibrate(f, 4, 2, 7) : { x: 0, y: 0 };
  const pose = land
    ? { squash: 0.7, sit: 0.6, armL: [70, 20] as [number, number], armR: [70, 20] as [number, number], legL: [40, 30] as [number, number], legR: [40, 30] as [number, number] }
    : { buff, armL: [120, -110] as [number, number], armR: [120, -110] as [number, number], legL: [16, 0] as [number, number], legR: [16, 0] as [number, number] };
  const hp = headPos(540, FLOOR, 1.25, pose);
  return <Page><Camera f={f} keys={track(BED_CAM, 262)} shake={{ x: kick(f, 0, 24, 7) + v.x, y: v.y }}>
    <Bedroom f={f} day="FRI" ring={1} lump={0} bedTilt={-6}>
      {f > 10 && <Aura x={540} y={FLOOR} h={640} w={300} f={f} />}
      <Bean x={540} y={FLOOR} s={1.25} face={land ? "strain" : "determined"} pose={pose} hat="headband" hatColour="#b8433f" />
      {f > 10 && <Sweat x={hp.x} y={hp.y} r={hp.r} f={f} />}
    </Bedroom>
  </Camera><Title lines={["FRIDAY:"]} f={f} /></Page>;
};
const B_roof: React.FC = () => {
  const f = useCurrentFrame();
  const t = easeOut(seg(f, 0, 30));
  const by = lerp(1450, 260, t);
  return <Page bg={SPACE}><Stars f={f} />
    <Camera f={f} keys={[{ f: 0, v: { x: W / 2, y: 1300, z: 1, r: 0 } }, { f: 40, v: { x: W / 2, y: 800, z: 0.92, r: -3 } }]} shake={{ x: kick(f, 0, 20, 7), y: 0 }}>
      <House x={540} y={1900} s={1.3} hole />
      <Debris x={540} y={1450} f={f} n={12} power={30} c="#b8433f" seed={4} />
      <Streaks x={540} y={by + 60} dx={0} dy={-1} len={520} n={7} spread={220} c="#dcfcfc" />
      <Aura x={540} y={by} h={560} w={240} f={f} />
      <Bean x={540} y={by} s={1.0} face="determined" pose={{ buff: 1, armL: [175, 0], armR: [20, 0], legL: [6, 0], legR: [10, 40] }} hat="headband" hatColour="#b8433f" />
    </Camera></Page>;
};
const B_burst: React.FC = () => { const f = useCurrentFrame(); return <Page bg="#0c0a0a"><SpeedBurst f={f} /></Page>; };
const B_hero: React.FC = () => {
  const f = useCurrentFrame();
  return <Page bg={SPACE}><Stars f={f} n={60} seed={9} />
    <Camera f={f} keys={push(48, 1, 1, W / 2, 1100)}>
      <Moon x={540} y={760} r={400} />
      <HeroRender x={540} y={1900} s={1.0} f={f} />
    </Camera><Flash f={f} d={4} /></Page>;
};

// ---------------- twist ----------------
const C_twist: React.FC = () => {
  const f = useCurrentFrame();
  const fall = easeIn(seg(f, 10, 20));
  return <Page><Camera f={f} keys={track(TWIST_CAM, 404)}>
    <Bedroom f={f} day="SAT" ring={1} lump={0} bedTilt={-6} />
    {fall < 1 && <g transform={`translate(${-20 * fall},${fall * 420}) rotate(${-25 * fall} 300 850)`} opacity={1 - fall}>
      <Calendar x={300} y={850} top="NOV" big="FRI" /></g>}
  </Camera></Page>;
};
const C_end: React.FC = () => {
  const f = useCurrentFrame();
  const up = easeOut(seg(onN(f), 0, 5)), slam = easeIn(seg(f, 5, 7));
  const hx = lerp(lerp(520, 210, up), 160, slam), hy = lerp(lerp(1180, 930, up), 1110, slam);
  const hit = f >= 7;
  return <Page><Camera f={f} keys={track(TWIST_CAM, 444)} shake={{ x: 0, y: kick(f, 7, 26, 7) }}>
    <Bedroom f={f} day="SAT" ring={hit ? 0 : 1} broken={hit}
      under={hit && f > 14 ? null : <Tube pts={[[540, 1215], [lerp(540, 380, up), lerp(1215, 1020, up) + slam * 40], [hx, hy]]} thick={40} />}>
      <Sleeper f={f} face={f < 16 ? "blank" : "sleep"} />
      {f > 20 && <Zs x={470} y={1010} f={f} />}
    </Bedroom>
    {hit && <Debris x={160} y={FLOOR - 200} f={f - 7} n={12} power={22} c="#b8433f" seed={8} />}
  </Camera></Page>;
};

const SCENES: Record<string, React.FC> = { A_wide, A_ring, A_eye, A_smash, A_back, B_card, B_ring, B_launch, B_flex, B_roof, B_burst, B_hero, C_twist, C_end };

export const AlarmShort: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ backgroundColor: PAPER }}>
    {SHOTS.map(s => {
      const C = SCENES[s.id];
      return <Sequence key={s.id} from={s.a} durationInFrames={s.b - s.a} name={s.id}><C /></Sequence>;
    })}
    {withAudio && <>
      <Sequence from={MUSIC.a} durationInFrames={MUSIC.b - MUSIC.a} name="music"><Audio src={staticFile("music/loop.wav")} loop volume={MUSIC.gain} /></Sequence>
      <Sequence from={MUSIC.resumeAt} durationInFrames={shot("C_end").b - MUSIC.resumeAt} name="music-out"><Audio src={staticFile("music/loop.wav")} loop volume={MUSIC.gain * 0.7} /></Sequence>
      {SFX.map((c, i) => (
        <Sequence key={i} from={c.f} durationInFrames={c.len ?? 48} name={`sfx ${c.name}`}>
          <Audio src={staticFile(`sfx/${c.name}.wav`)} volume={c.gain ?? 1} loop={!!c.len} />
        </Sequence>
      ))}
    </>}
  </AbsoluteFill>
);

export { NIGHT };
