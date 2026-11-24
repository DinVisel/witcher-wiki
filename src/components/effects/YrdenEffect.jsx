import { useTimeout } from "../../hooks/useTimeout";

const GLYPHS = [
  { char: "ᛉ", pos: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" },
  { char: "ᛟ", pos: "left-[7%] top-[75%] -translate-x-1/2 -translate-y-1/2" },
  { char: "ᚦ", pos: "left-[93%] top-[75%] -translate-x-1/2 -translate-y-1/2" },
];

/** Yrden: a purple trap circle with runes, two rings spinning in opposite directions. */
export default function YrdenEffect({ onDone }) {
  useTimeout(onDone, 1800);
  return (
    <div className="absolute inset-0 grid place-items-center animate-fade-in">
      <span className="col-start-1 row-start-1 aspect-square h-[80%] max-w-[90%] rounded-full bg-yrden/15 motion-safe:animate-pulse" />
      <span className="relative col-start-1 row-start-1 aspect-square h-[75%] max-w-[85%] rounded-full border-2 border-yrden shadow-[0_0_25px] shadow-yrden/70 motion-safe:animate-rune-spin">
        {GLYPHS.map((g) => (
          <span key={g.char} className={`absolute ${g.pos} text-2xl text-yrden drop-shadow-[0_0_6px_var(--color-yrden)]`}>
            {g.char}
          </span>
        ))}
      </span>
      <span className="col-start-1 row-start-1 aspect-square h-[50%] max-w-[60%] rounded-full border-2 border-dashed border-yrden/80 motion-safe:animate-rune-spin [animation-direction:reverse] [animation-duration:3s]" />
    </div>
  );
}
