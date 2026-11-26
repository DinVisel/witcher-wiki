import { useContext } from "react";
import { JournalContext } from "../context/JournalContext";

/** Access the Journal: { unlocked, clues, unlock, findClue, toasts, dismissToast, reset }. */
export function useJournal() {
  return useContext(JournalContext);
}
