import { itemPath, SECTIONS } from "../config/sections";
import { findSign } from "../config/signs";
import ItemCard from "./ItemCard";
import SignEffect from "./effects/SignEffect";

/**
 * A Signs-page card. Castable signs get a glow in their colour, a Cast button
 * and their effect drawn over the card. `casting` is the page's current cast.
 */
export default function SignCard({ item, casting, onCast, onDone }) {
  const sign = findSign(item.title);
  const active = sign && casting?.name === sign.name ? casting : null;

  return (
    <div className={`relative flex h-full flex-col ${active ? sign.castWrapper : ""}`}>
      <div className={`flex-1 transition duration-300 ${active ? sign.castContent : ""}`}>
        <ItemCard
          {...item}
          to={itemPath(SECTIONS.signs, item.title)}
          variant="rune"
          className={sign ? `shadow-[0_0_30px] ${sign.glow}` : ""}
        />
      </div>
      <SignEffect casting={active} onDone={onDone} />
      {sign && (
        <button
          type="button"
          onClick={() => onCast(sign.name)}
          aria-label={`Cast ${sign.name}`}
          aria-pressed={sign.persistent ? Boolean(active) : undefined}
          title={`${sign.hint} — press ${sign.key}`}
          className={`relative z-20 mt-3 flex items-center justify-between rounded-md border bg-ink px-4 py-2 font-display text-sm font-semibold tracking-widest transition hover:bg-silver/5 ${sign.border} ${sign.text}`}
        >
          <span>{active && sign.persistent ? "Dismiss" : `Cast ${sign.name}`}</span>
          <kbd className="rounded border border-current/40 px-1.5 text-xs">{sign.key}</kbd>
        </button>
      )}
    </div>
  );
}
