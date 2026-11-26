import { useEffect } from "react";
import { useJournal } from "../hooks/useJournal";

const SECRET = "gwent";

/**
 * Listens for the word "gwent" typed anywhere (including in search boxes)
 * and unlocks the matching Journal entry. Renders nothing.
 */
export default function KeyboardSecrets() {
  const { unlock } = useJournal();

  useEffect(() => {
    let typed = "";
    const onKey = (e) => {
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-SECRET.length);
      if (typed === SECRET) unlock("gwent");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock]);

  return null;
}
