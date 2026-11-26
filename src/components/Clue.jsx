import { useContext } from "react";
import { SensesContext } from "../context/SensesContext";
import { useJournal } from "../hooks/useJournal";

/**
 * A hidden clue (red claw marks) for the Witcher Senses hunt. Invisible until
 * Witcher Senses is switched on; clicking it records the clue in the Journal.
 * Position it with `className` (e.g. "absolute right-2 top-2").
 */
export default function Clue({ id, className = "" }) {
  const { on } = useContext(SensesContext);
  const { clues, findClue } = useJournal();
  if (!on) return null;
  const found = clues.includes(id);

  return (
    <button
      type="button"
      onClick={() => findClue(id)}
      aria-label={found ? "Clue already followed" : "Strange claw marks — examine"}
      title={found ? "Clue followed" : "Examine the claw marks"}
      className={`${className} grid size-10 place-items-center rounded-full transition ${
        found ? "text-gold/60" : "text-[#ff2a2a] drop-shadow-[0_0_10px_rgb(255_42_42/0.9)] motion-safe:animate-pulse hover:scale-110"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        {found ? (
          <path d="M5 12l4 4 10-10" />
        ) : (
          <path d="M6 4 C9 9 9 15 6 20 M11 3 C14 9 14 15 11 21 M16 4 C19 9 19 15 16 20" />
        )}
      </svg>
    </button>
  );
}
