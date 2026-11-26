import { useEffect, useState } from "react";

/**
 * True while the page is being scrolled, false `delay` ms after it stops.
 * Only listens while `enabled`, so it costs nothing when unused.
 */
export function useIsScrolling(enabled = true, delay = 180) {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    let timer;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), delay);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [enabled, delay]);

  return enabled && scrolling;
}
