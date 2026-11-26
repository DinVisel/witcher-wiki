import { useEffect, useState } from "react";

/**
 * Index of the child of `containerRef` that crosses a horizontal line at
 * `line` × viewport height (e.g. 0.45 = a bit above the middle), or -1.
 * Recomputed on scroll/resize (once per animation frame) while `enabled`.
 */
export function useActiveChild(containerRef, enabled, line = 0.45) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const y = window.innerHeight * line;
      const children = [...(containerRef.current?.children ?? [])];
      setActive(
        children.findIndex((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= y && r.bottom >= y;
        }),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure); // first measurement on the next frame
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef, enabled, line]);

  return enabled ? active : -1;
}
