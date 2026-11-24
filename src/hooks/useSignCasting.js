import { useCallback, useRef, useState } from "react";
import { findSign } from "../config/signs";
import { useSound } from "./useSound";

/**
 * Tracks which sign is being cast and plays its sound.
 * `casting` is { name, id } or null; a new id restarts the effect on recast.
 * Persistent signs (Quen) stay up until cast again.
 */
export function useSignCasting() {
  const [casting, setCasting] = useState(null);
  const counter = useRef(0);
  const current = useRef(null);
  const play = useSound();

  const cast = useCallback(
    (name) => {
      const sign = findSign(name);
      if (!sign) return;
      if (sign.persistent && current.current?.name === sign.name) {
        current.current = null; // casting Quen again dismisses the shield
        setCasting(null);
        return;
      }
      counter.current += 1;
      current.current = { name: sign.name, id: counter.current };
      setCasting(current.current);
      play(sign.sound);
    },
    [play],
  );

  // Called by an effect when its animation ends; ignores outdated effects.
  const finish = useCallback((id) => {
    if (current.current?.id !== id) return;
    current.current = null;
    setCasting(null);
  }, []);

  return { casting, cast, finish };
}
