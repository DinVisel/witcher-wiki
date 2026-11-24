import { createContext, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "witcher-wiki:muted";

/** Global sound on/off. `muted` is remembered in localStorage. */
// eslint-disable-next-line react-refresh/only-export-components
export const SoundContext = createContext({ muted: false, toggleMute: () => {} });

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(readMuted);
  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
  }, [muted]);

  return <SoundContext.Provider value={{ muted, toggleMute }}>{children}</SoundContext.Provider>;
}
