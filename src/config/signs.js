// The five castable signs: keyboard key, sound file and Tailwind classes.
// Class names are written out in full so Tailwind can find them.

export const SIGNS = [
  {
    name: "Igni",
    key: "1",
    sound: "igni.wav",
    hint: "Fire burst",
    persistent: false,
    text: "text-igni",
    border: "border-igni",
    glow: "shadow-igni/30 hover:shadow-igni/60",
    castWrapper: "",
    castContent: "",
  },
  {
    name: "Aard",
    key: "2",
    sound: "aard.wav",
    hint: "Telekinetic blast",
    persistent: false,
    text: "text-aard",
    border: "border-aard",
    glow: "shadow-aard/30 hover:shadow-aard/60",
    castWrapper: "motion-safe:animate-shake",
    castContent: "",
  },
  {
    name: "Quen",
    key: "3",
    sound: "quen.wav",
    hint: "Protective shield (cast again to dismiss)",
    persistent: true,
    text: "text-quen",
    border: "border-quen",
    glow: "shadow-quen/30 hover:shadow-quen/60",
    castWrapper: "",
    castContent: "",
  },
  {
    name: "Yrden",
    key: "4",
    sound: "yrden.wav",
    hint: "Magic trap",
    persistent: false,
    text: "text-yrden",
    border: "border-yrden",
    glow: "shadow-yrden/30 hover:shadow-yrden/60",
    castWrapper: "",
    castContent: "",
  },
  {
    name: "Axii",
    key: "5",
    sound: "axii.wav",
    hint: "Mind trick",
    persistent: false,
    text: "text-axii",
    border: "border-axii",
    glow: "shadow-axii/30 hover:shadow-axii/60",
    castWrapper: "",
    castContent: "blur-sm",
  },
];

/** Look up a castable sign by its wiki title (case-insensitive). */
export function findSign(title = "") {
  return SIGNS.find((s) => s.name.toLowerCase() === title.toLowerCase()) ?? null;
}
