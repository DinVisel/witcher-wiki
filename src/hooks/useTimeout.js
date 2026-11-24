import { useEffect, useRef } from "react";

/** Calls `callback` once after `ms` (skipped when ms is null). Cleared on unmount. */
export function useTimeout(callback, ms) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (ms == null) return undefined;
    const id = setTimeout(() => saved.current?.(), ms);
    return () => clearTimeout(id);
  }, [ms]);
}
