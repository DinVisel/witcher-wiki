import { useEffect, useId, useRef, useState } from "react";

/**
 * A round "i" button that toggles a small explanation panel.
 * Closes on Escape or a click outside. `label` is the button's accessible name.
 */
export default function InfoButton({ label, title, children }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => !wrapperRef.current?.contains(e.target) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        title={label}
        className={`grid size-6 place-items-center rounded-full border font-display text-xs font-bold transition ${
          open ? "border-gold bg-gold text-ink" : "border-gold/60 text-gold hover:bg-gold/15"
        }`}
      >
        i
      </button>
      {open && (
        <div
          id={panelId}
          role="note"
          className="absolute left-0 top-8 z-30 w-72 max-w-[calc(100vw-2rem)] rounded-md border border-gold/40 bg-ink/95 p-4 text-left text-sm text-silver shadow-[0_10px_30px_rgb(0_0_0/0.6)] motion-safe:animate-fade-in"
        >
          {title && <p className="mb-2 font-display text-gold">{title}</p>}
          {children}
        </div>
      )}
    </span>
  );
}
