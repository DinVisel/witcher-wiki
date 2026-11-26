/**
 * A standing witcher mascot (original inline SVG): white hair, dark armour,
 * two swords on the back and the wolf medallion. `className` sets size/motion;
 * extra props (x, y, width, height) place it inside another SVG.
 */
export default function Geralt({ className = "w-10", ...svgProps }) {
  return (
    <svg viewBox="0 0 40 84" className={className} aria-hidden="true" {...svgProps}>
      {/* swords crossed on the back */}
      <path d="M6 56 L34 8" className="stroke-steel" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 56 L8 6" className="stroke-silver" strokeWidth="2" strokeLinecap="round" />
      {/* legs and boots */}
      <rect x="13" y="50" width="6" height="24" rx="2" className="fill-ink" />
      <rect x="21" y="50" width="6" height="24" rx="2" className="fill-ink" />
      <rect x="12" y="72" width="8" height="6" rx="2" className="fill-[#1a110c]" />
      <rect x="20" y="72" width="8" height="6" rx="2" className="fill-[#1a110c]" />
      {/* torso, belt, arms */}
      <path d="M11 22 L29 22 L30 52 L10 52Z" className="fill-ash stroke-ink" strokeWidth="1" />
      <path d="M10 42 L30 42" className="stroke-[#5e3820]" strokeWidth="3" />
      <rect x="6" y="24" width="5" height="22" rx="2.5" className="fill-ash" />
      <rect x="29" y="24" width="5" height="22" rx="2.5" className="fill-ash" />
      <circle cx="20" cy="30" r="2.6" className="fill-gold" />
      {/* head with white hair */}
      <circle cx="20" cy="13" r="7.5" className="fill-[#e8c9a8]" />
      <path d="M12 13 C11 2 29 2 28 13 L26 9 C23 6 17 6 14 9 L14 22 L11 20Z" className="fill-silver" />
      <path d="M26 9 L28 13 L28 21 L26 20Z" className="fill-silver" />
      <circle cx="17" cy="13" r="0.9" className="fill-quen" />
      <circle cx="23" cy="13" r="0.9" className="fill-quen" />
    </svg>
  );
}
