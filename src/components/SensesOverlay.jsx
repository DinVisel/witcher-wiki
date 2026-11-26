import { useContext } from "react";
import { SensesContext } from "../context/SensesContext";
import { useJournal } from "../hooks/useJournal";
import { CLUES } from "../config/achievements";

/** Red vignette + a small status pill while Witcher Senses is on. */
export default function SensesOverlay() {
  const { on, toggle } = useContext(SensesContext);
  const { clues } = useJournal();
  if (!on) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-radial from-transparent via-blood/10 to-[#ff2a2a]/30 motion-safe:animate-fade-in"
      />
      <div
        role="status"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-full border border-[#ff2a2a]/60 bg-ink/90 px-4 py-2 text-sm text-parchment shadow-[0_0_20px_rgb(255_42_42/0.35)]"
      >
        <span>
          Witcher Senses — look for red claw marks ({clues.length}/{CLUES.length})
        </span>
        <button type="button" onClick={toggle} className="text-xs text-steel underline-offset-2 hover:text-gold hover:underline">
          Turn off
        </button>
      </div>
    </>
  );
}
