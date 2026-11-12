// Synthesised SFX + an original music loop, written as 48 kHz WAVs into public/. Node only, no samples.
//   node scripts/sfx.mjs            -> public/sfx/*.wav, public/music/loop.wav
// The reference reels carry NO narration: music bed + cartoon SFX + grunts/gibberish/laughs.
// Grunts and voices are best recorded by you (phone mic is fine) into public/sfx/<name>.wav — same names work.
import fs from "node:fs";
import path from "node:path";

const SR = 48000;
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const buf = sec => new Float32Array(Math.round(sec * SR));
const env = (t, a, d, len) => (t < a ? t / a : t > len - d ? Math.max(0, (len - t) / d) : 1);
const TAU = Math.PI * 2;

function write(file, data) {
  let peak = 0; for (const v of data) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0.95 ? 0.95 / peak : 1;
  const b = Buffer.alloc(44 + data.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + data.length * 2, 4); b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, b);
}
// one-pole low-pass
const lp = (x, k) => { let y = 0; return x.map(v => (y += k * (v - y))); };
const hp = (x, k) => { let y = 0, p = 0; return x.map(v => { y = k * (y + v - p); p = v; return y; }); };
const noise = sec => buf(sec).map(() => rand());

const S = {
  // filtered-noise inhale/exhale with a low rumble, ~1.4 s (looped by the cue)
  snore() { const d = noise(1.4), r = buf(1.4); return lp(d, 0.03).map((v, i) => { const t = i / SR; const br = Math.sin(TAU * t / 1.4) ** 2; return (v * 2.2 + Math.sin(TAU * 70 * t) * 0.35 * (Math.sin(TAU * 31 * t) > 0 ? 1 : 0.4)) * br * 0.7 + r[i]; }); },
  // bell: two inharmonic partials hammered at 18 Hz
  ring() { const d = buf(1); return d.map((_, i) => { const t = i / SR, h = (t * 18) % 1; return (Math.sin(TAU * 2350 * t) * 0.5 + Math.sin(TAU * 3170 * t) * 0.3 + Math.sin(TAU * 4400 * t) * 0.15) * Math.exp(-h * 6); }); },
  smash() { const d = noise(0.7); return d.map((v, i) => { const t = i / SR; return (v * Math.exp(-t * 9) + Math.sin(TAU * 90 * t * (1 - t)) * Math.exp(-t * 14) * 1.2); }); },
  debris() { const d = buf(0.8); for (let k = 0; k < 16; k++) { const at = Math.floor(((rand() + 1) / 2) * 0.7 * SR), f = 2000 + ((rand() + 1) / 2) * 4000; for (let i = 0; i < 2400 && at + i < d.length; i++) d[at + i] += Math.sin(TAU * f * i / SR) * Math.exp(-i / 300) * 0.4; } return d; },
  pop() { const d = buf(0.18); return d.map((_, i) => { const t = i / SR; return Math.sin(TAU * (600 + 900 * t / 0.18) * t) * Math.exp(-t * 30); }); },
  boing() { const d = buf(0.6); let ph = 0; return d.map((_, i) => { const t = i / SR; ph += TAU * (180 + 120 * Math.sin(TAU * 11 * t) * Math.exp(-t * 3) + 160 * t) / SR; return Math.sin(ph) * Math.exp(-t * 4); }); },
  whoosh() { const d = noise(0.6); let y = 0; return d.map((v, i) => { const t = i / SR, k = 0.02 + 0.25 * Math.sin(Math.PI * t / 0.6); y += k * (v - y); return y * Math.sin(Math.PI * t / 0.6) * 2.4; }); },
  thud() { const d = buf(0.5); return d.map((_, i) => { const t = i / SR; return Math.sin(TAU * 60 * t * (1 - t * 0.8)) * Math.exp(-t * 10) * 1.3 + rand() * Math.exp(-t * 40) * 0.3; }); },
  // rising saw swell + shimmer
  powerup() { const d = buf(1.6); let ph = 0; return d.map((_, i) => { const t = i / SR; ph += (120 + 500 * t * t) / SR; const saw = (ph % 1) * 2 - 1; return (saw * 0.35 + Math.sin(TAU * 1800 * t * (1 + t)) * 0.08 * ((rand() + 1) / 2)) * Math.min(1, t * 2) * Math.exp(-Math.max(0, t - 1.2) * 8); }); },
  crash() { const d = noise(1.2); return lp(d, 0.3).map((v, i) => { const t = i / SR; return v * Math.exp(-t * 3.5) * 1.6 + Math.sin(TAU * 55 * t) * Math.exp(-t * 6); }); },
  boom() { const d = noise(1.6); return lp(d, 0.05).map((v, i) => { const t = i / SR; return (v * 3 + Math.sin(TAU * 42 * t) * 1.2) * Math.exp(-t * 2.2); }); },
  // "AAAH" choir chord: detuned vowel-ish saws through a formant low-pass
  choir() { const d = buf(2.2); const notes = [220, 277.2, 329.6, 440]; return lp(d.map((_, i) => { const t = i / SR; let s = 0; for (const n of notes) for (const dt of [-0.6, 0, 0.7]) s += ((t * (n + dt)) % 1) * 2 - 1; return s / 12 * Math.min(1, t * 3) * Math.min(1, (2.2 - t) * 2) * (1 + 0.1 * Math.sin(TAU * 5 * t)); }), 0.12); },
  // record scratch: fast pitch sweep of noise
  scratch() { const d = noise(0.35); let y = 0; return d.map((v, i) => { const t = i / SR, k = 0.05 + 0.5 * Math.abs(Math.sin(TAU * 6 * t)); y += k * (v - y); return y * 2 * Math.exp(-t * 4); }); },
};

for (const [name, fn] of Object.entries(S)) { write(`public/sfx/${name}.wav`, fn()); console.log("sfx", name); }

// ---- music: an original, light "silly" loop, 100 BPM, 8 bars, key of C: plucky bass + marimba-ish melody + soft kick/hat.
function music() {
  const bpm = 100, beat = 60 / bpm, bars = 8, len = bars * 4 * beat, d = buf(len);
  const add = (at, dur, fn) => { const a = Math.floor(at * SR); for (let i = 0; i < dur * SR && a + i < d.length; i++) d[a + i] += fn(i / SR); };
  const midi = m => 440 * 2 ** ((m - 69) / 12);
  const prog = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]]; // C Am F G
  const mel = [72, 74, 76, 79, 76, 74, 72, -1, 69, 72, 74, 72, 69, 67, 69, -1, 65, 69, 72, 74, 72, 69, 65, -1, 67, 71, 74, 76, 74, 71, 67, 67];
  for (let bar = 0; bar < bars; bar++) {
    const ch = prog[bar % 4], t0 = bar * 4 * beat;
    for (let b = 0; b < 4; b++) {
      const t = t0 + b * beat;
      add(t, 0.25, x => Math.sin(TAU * 55 * x * (1 - x * 2)) * Math.exp(-x * 18) * (b % 2 ? 0.25 : 0.5));         // kick
      add(t + beat / 2, 0.05, x => rand() * Math.exp(-x * 90) * 0.08);                                                // hat
      add(t, beat * 0.9, x => (((x * midi(ch[0] - 12)) % 1) < 0.5 ? 0.18 : -0.18) * Math.exp(-x * 5));               // bass
      if (b % 2 === 1) for (const n of ch) add(t, beat * 0.5, x => Math.sin(TAU * midi(n) * x) * Math.exp(-x * 9) * 0.07); // chord stab
    }
    for (let k = 0; k < 8; k++) {
      const n = mel[(bar % 4) * 8 + k]; if (n < 0) continue;
      add(t0 + k * beat / 2, beat * 0.5, x => (Math.sin(TAU * midi(n) * x) + 0.3 * Math.sin(TAU * midi(n) * 4 * x) * Math.exp(-x * 30)) * Math.exp(-x * 7) * 0.16);
    }
  }
  return hp(d, 0.995);
}
write("public/music/loop.wav", music());
console.log("music loop");
