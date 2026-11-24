import { useTimeout } from "../../hooks/useTimeout";

const RINGS = [
  "h-[80%] [animation-duration:2.4s] border-t-transparent border-b-transparent",
  "h-[60%] [animation-duration:1.6s] [animation-direction:reverse] border-l-transparent border-r-transparent",
  "h-[40%] [animation-duration:1s] border-t-transparent",
  "h-[20%] [animation-duration:0.7s] [animation-direction:reverse] border-b-transparent",
];

/** Axii: hypnotic concentric rings spinning at different speeds (the card blurs). */
export default function AxiiEffect({ onDone }) {
  useTimeout(onDone, 1400);
  return (
    <div className="absolute inset-0 grid place-items-center animate-fade-in">
      <span className="col-start-1 row-start-1 aspect-square h-[90%] max-w-full rounded-full bg-radial from-axii/30 to-transparent to-70% motion-safe:animate-pulse" />
      {RINGS.map((ring) => (
        <span
          key={ring}
          className={`col-start-1 row-start-1 aspect-square max-w-full rounded-full border-4 border-axii shadow-[0_0_12px] shadow-axii/60 motion-safe:animate-rune-spin ${ring}`}
        />
      ))}
    </div>
  );
}
