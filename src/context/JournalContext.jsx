import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ACHIEVEMENTS, CLUES } from "../config/achievements";

const KEY = "witcher-wiki:journal";

/** Journal state: unlocked achievements, found clues and pending toasts. */
// eslint-disable-next-line react-refresh/only-export-components
export const JournalContext = createContext(null);

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return { unlocked: saved?.unlocked ?? [], clues: saved?.clues ?? [] };
  } catch {
    return { unlocked: [], clues: [] };
  }
}

/**
 * Provides unlock(id), findClue(id), reset() and the toast queue.
 * Progress is saved to localStorage (wrapped in try/catch; works without it).
 */
export function JournalProvider({ children }) {
  const [saved, setSaved] = useState(readSaved);
  const [toasts, setToasts] = useState([]);
  const savedRef = useRef(saved);
  const toastId = useRef(0);

  useEffect(() => {
    savedRef.current = saved;
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      // storage blocked: progress lasts for this visit only
    }
  }, [saved]);

  const unlock = useCallback((id) => {
    const current = savedRef.current;
    if (current.unlocked.includes(id)) return;
    const next = { ...current, unlocked: [...current.unlocked, id] };
    savedRef.current = next;
    setSaved(next);
    const entry = ACHIEVEMENTS.find((a) => a.id === id);
    toastId.current += 1;
    setToasts((t) => [...t, { key: toastId.current, title: entry?.title ?? id }]);
  }, []);

  const findClue = useCallback(
    (id) => {
      const current = savedRef.current;
      if (current.clues.includes(id)) return;
      const next = { ...current, clues: [...current.clues, id] };
      savedRef.current = next;
      setSaved(next);
      if (next.clues.length === CLUES.length) unlock("senses");
    },
    [unlock],
  );

  const dismissToast = useCallback((key) => setToasts((t) => t.filter((x) => x.key !== key)), []);

  const reset = useCallback(() => {
    const empty = { unlocked: [], clues: [] };
    savedRef.current = empty;
    setSaved(empty);
  }, []);

  const value = useMemo(
    () => ({ unlocked: saved.unlocked, clues: saved.clues, toasts, unlock, findClue, dismissToast, reset }),
    [saved, toasts, unlock, findClue, dismissToast, reset],
  );
  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}
