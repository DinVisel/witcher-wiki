import { useState } from "react";
import { useJournal } from "../hooks/useJournal";
import Roach from "./mascots/Roach";

/** Easter egg on the Locations page: a little house with Roach somehow standing on its roof. */
export default function RooftopRoach() {
  const { unlock } = useJournal();
  const [said, setSaid] = useState(false);

  const click = () => {
    setSaid(true);
    unlock("rooftop");
  };

  return (
    <div className="flex items-end gap-2">
      {said && (
        <p role="status" className="mb-6 max-w-40 text-right text-xs italic text-parchment/80 motion-safe:animate-fade-in">
          …how did she even get up there?
        </p>
      )}
      <button
        type="button"
        onClick={click}
        aria-label="A horse on a rooftop?"
        title="Is that… a horse on the roof?"
        className="group relative h-16 w-20 shrink-0 transition hover:-translate-y-0.5"
      >
        <svg viewBox="0 0 80 64" className="absolute inset-0 size-full" aria-hidden="true">
          <rect x="14" y="34" width="52" height="28" className="fill-[#6b4a2b] stroke-[#2b1a12]" strokeWidth="1.5" />
          <path d="M8 36 L40 16 L72 36Z" className="fill-[#5a1712] stroke-[#2b0807]" strokeWidth="1.5" />
          <rect x="34" y="44" width="12" height="18" className="fill-[#2b1a12]" />
          <rect x="20" y="40" width="9" height="8" className="fill-quen/70" />
          <rect x="52" y="40" width="9" height="8" className="fill-quen/70" />
        </svg>
        <Roach className="absolute -top-4 left-6 w-9 transition group-hover:-rotate-6" />
      </button>
    </div>
  );
}
