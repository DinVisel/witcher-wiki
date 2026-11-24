// Generates the five sign sound effects as small mono WAV files in public/sounds.
// They are synthesised from scratch (noise + sine waves), so they are original
// and free to use. Run with: npm run sounds

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RATE = 22050;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sounds");

/** Fill `seconds` of audio with fn(t, i) → sample in [-1, 1]. */
function render(seconds, fn) {
  const n = Math.floor(seconds * RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / RATE, i);
  return out;
}

/** Attack/release envelope. */
const env = (t, attack, length, curve = 2) =>
  t < attack ? t / attack : Math.max(0, 1 - (t - attack) / (length - attack)) ** curve;

/** One-pole low-pass filtered white noise generator. */
function lowNoise() {
  let last = 0;
  return (cutoff) => {
    const a = Math.min(1, (2 * Math.PI * cutoff) / RATE);
    last += a * (Math.random() * 2 - 1 - last);
    return last;
  };
}

const sin = (f, t) => Math.sin(2 * Math.PI * f * t);

const SOUNDS = {
  // Fire whoosh: filtered noise sweeping up then down, with a crackle.
  "igni.wav": (() => {
    const noise = lowNoise();
    return render(1.2, (t) => {
      const cutoff = 300 + 3500 * Math.sin(Math.PI * Math.min(t / 1.0, 1));
      const crackle = Math.random() < 0.003 ? (Math.random() - 0.5) * 1.5 : 0;
      return (noise(cutoff) * 2.2 + crackle) * env(t, 0.08, 1.2, 1.5);
    });
  })(),
  // Wind blast: a deep thump plus a burst of noise.
  "aard.wav": (() => {
    const noise = lowNoise();
    let phase = 0;
    return render(1.0, (t) => {
      phase += (2 * Math.PI * (40 + 110 * Math.exp(-t * 8))) / RATE;
      const thump = Math.sin(phase) * Math.exp(-t * 5);
      return thump * 0.9 + noise(1800 * Math.exp(-t * 3) + 200) * 2 * env(t, 0.01, 1.0, 3);
    });
  })(),
  // Shield hum: stacked sines with a slow tremolo.
  "quen.wav": render(1.4, (t) => {
    const trem = 0.75 + 0.25 * sin(6, t);
    const tone = sin(220, t) * 0.5 + sin(330, t) * 0.3 + sin(440, t) * 0.2 + sin(661, t) * 0.08;
    return tone * trem * env(t, 0.15, 1.4, 1.2) * 0.7;
  }),
  // Magic trap: detuned eerie drone plus an inharmonic bell strike.
  "yrden.wav": render(1.8, (t) => {
    const drone = (sin(146.8, t) + sin(147.9, t) + sin(293.7 + 3 * sin(0.7, t), t) * 0.5) * 0.25;
    const bell = (sin(880, t) + sin(1203, t) * 0.6 + sin(1771, t) * 0.4) * Math.exp(-t * 4) * 0.35;
    return (drone * env(t, 0.3, 1.8, 1) + bell) * 0.8;
  }),
  // Mystic chime: a falling arpeggio of soft bells with vibrato.
  "axii.wav": render(1.4, (t) => {
    const notes = [1318.5, 987.8, 784, 659.3];
    let s = 0;
    notes.forEach((f, k) => {
      const start = k * 0.12;
      if (t >= start) {
        const local = t - start;
        s += sin(f * (1 + 0.004 * sin(5, t)), local) * Math.exp(-local * 3.5) * 0.3;
      }
    });
    return s;
  }),
};

/** Encode float samples as a 16-bit PCM WAV buffer (normalised to -1 dBFS). */
function toWav(samples) {
  const peak = samples.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1;
  const gain = 0.89 / peak;
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * gain)) * 32767), 44 + i * 2));
  return buf;
}

mkdirSync(OUT, { recursive: true });
for (const [file, samples] of Object.entries(SOUNDS)) {
  const wav = toWav(samples);
  writeFileSync(join(OUT, file), wav);
  console.log(`${file}  ${(wav.length / 1024).toFixed(0)} KB`);
}
