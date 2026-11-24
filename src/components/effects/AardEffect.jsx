import { useTimeout } from "../../hooks/useTimeout";

const RINGS = ["[animation-delay:0ms]", "[animation-delay:150ms]", "[animation-delay:300ms]"];

/** Aard: three blue shockwave rings expanding from the centre (the card also shakes). */
export default function AardEffect({ onDone }) {
  useTimeout(onDone, 1000);
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="absolute inset-0 bg-radial from-aard/25 to-transparent to-70% animate-fade-out" />
      {RINGS.map((delay) => (
        <span
          key={delay}
          className={`col-start-1 row-start-1 size-24 rounded-full border-4 border-aard opacity-0 shadow-[0_0_20px] shadow-aard/70 motion-safe:animate-shockwave motion-reduce:animate-fade-out ${delay}`}
        />
      ))}
    </div>
  );
}
