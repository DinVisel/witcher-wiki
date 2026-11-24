import { useCallback, useContext, useRef } from "react";
import { SoundContext } from "../context/SoundContext";

/**
 * Returns play(file) for sound files in /public/sounds. Does nothing when muted.
 * Audio objects are cached per file; browsers only allow sound after a user
 * gesture, and we only ever play on clicks / key presses.
 */
export function useSound(volume = 0.6) {
  const { muted } = useContext(SoundContext);
  const cache = useRef(new Map());

  return useCallback(
    (file) => {
      if (muted || !file) return;
      let audio = cache.current.get(file);
      if (!audio) {
        audio = new Audio(`/sounds/${file}`);
        cache.current.set(file, audio);
      }
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    },
    [muted, volume],
  );
}
