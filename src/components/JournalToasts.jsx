import { Link } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTimeout } from "../hooks/useTimeout";

/** One toast; removes itself after a few seconds. */
function Toast({ toast, onDone }) {
  useTimeout(() => onDone(toast.key), 4500);
  return (
    <li className="pointer-events-auto flex items-center gap-3 rounded-md border border-gold/60 bg-ink/95 px-4 py-3 shadow-[0_10px_30px_rgb(0_0_0/0.6)] motion-safe:animate-rise-in">
      <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M5 4h11l3 3v13H5zM8 9h8M8 13h8M8 17h5" />
      </svg>
      <div className="text-sm">
        <p className="font-display text-xs uppercase tracking-widest text-gold">Journal updated</p>
        <p className="text-parchment">{toast.title}</p>
      </div>
      <Link to="/journal" className="ml-2 text-xs text-steel underline-offset-2 hover:text-gold hover:underline">
        Open
      </Link>
    </li>
  );
}

/** Stack of "Journal updated" pop-ups in the corner; announced to screen readers. */
export default function JournalToasts() {
  const { toasts, dismissToast } = useJournal();
  return (
    <ul aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.key} toast={t} onDone={dismissToast} />
      ))}
    </ul>
  );
}
