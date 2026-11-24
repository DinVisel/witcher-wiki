import { useEffect } from "react";
import { SECTIONS } from "../config/sections";
import { SIGNS } from "../config/signs";
import { useSignCasting } from "../hooks/useSignCasting";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ListingView from "../components/ListingView";
import SignCard from "../components/SignCard";

/** Keys 1–5 cast the signs. Ignored while typing in an input. */
function useSignShortcuts(cast) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;
      const sign = SIGNS.find((s) => s.key === e.key);
      if (sign) cast(sign.name);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cast]);
}

/** The Signs page: a dark rune panel where every witcher sign can be cast. */
export default function SignsPage() {
  useDocumentTitle("Signs");
  const { casting, cast, finish } = useSignCasting();
  useSignShortcuts(cast);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-4 -top-8 h-72 bg-radial-[at_50%_0%] from-gold/15 to-transparent to-70%"
      />
      <ListingView
        className="relative"
        section={SECTIONS.signs}
        filters={
          <p className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-steel">
            <span>Shortcuts:</span>
            {SIGNS.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <kbd className={`rounded border px-1.5 text-xs ${s.border} ${s.text}`}>{s.key}</kbd>
                {s.name}
              </span>
            ))}
          </p>
        }
        renderItem={(item) => <SignCard item={item} casting={casting} onCast={cast} onDone={finish} />}
      />
    </div>
  );
}
