/**
 * Small travellers met on the Story road (original inline SVGs, 40×40).
 * kind: "merchant" (hooded pedlar with a pack), "dog" (a friendly stray),
 * "drowner" (peeking out of a puddle). Extra props place it inside another SVG.
 */
export default function Traveller({ kind, ...svgProps }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" {...svgProps}>
      {kind === "merchant" && (
        <g>
          <path d="M28 10 L33 38" className="stroke-[#6b4a2b]" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="7" y="13" width="11" height="16" rx="3" className="fill-[#5e3820] stroke-[#2b1a12]" strokeWidth="0.8" />
          <path d="M14 12 C14 4 26 4 26 12 L28 34 L12 34Z" className="fill-[#6d5a3a]" />
          <circle cx="21" cy="12" r="4.5" className="fill-[#e8c9a8]" />
          <path d="M15 12 C15 5 27 5 27 12 L25 9 C22 7 19 7 17 9Z" className="fill-[#4a3a24]" />
          <rect x="14" y="33" width="5" height="4" rx="1" className="fill-[#2b1a12]" />
          <rect x="21" y="33" width="5" height="4" rx="1" className="fill-[#2b1a12]" />
          <circle cx="12.5" cy="18" r="1.6" className="fill-gold" />
        </g>
      )}
      {kind === "dog" && (
        <g>
          <path d="M6 20 C2 16 3 12 6 13" className="fill-none stroke-[#8a8f96]" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="17" cy="24" rx="11" ry="6" className="fill-[#8a8f96]" />
          <rect x="8" y="26" width="3.5" height="10" rx="1.5" className="fill-[#6f747b]" />
          <rect x="22" y="26" width="3.5" height="10" rx="1.5" className="fill-[#6f747b]" />
          <path d="M25 22 C26 14 34 13 36 19 L38 21 L33 24 C30 25 27 25 25 22Z" className="fill-[#8a8f96]" />
          <path d="M29 14 L31 9 L33 15Z" className="fill-[#6f747b]" />
          <circle cx="33" cy="18" r="1" className="fill-ink" />
          <circle cx="37.5" cy="20.5" r="1" className="fill-ink" />
        </g>
      )}
      {kind === "drowner" && (
        <g>
          <ellipse cx="20" cy="33" rx="17" ry="5" className="fill-[#2b4a5e] stroke-[#4f7f9a]" strokeWidth="1" />
          <path d="M11 33 C11 20 29 20 29 33Z" className="fill-[#4b6b4f]" />
          <circle cx="16" cy="26" r="1.6" className="fill-quen" />
          <circle cx="24" cy="26" r="1.6" className="fill-quen" />
          <path d="M15 30 L17 28 L19 30 L21 28 L23 30 L25 28" className="fill-none stroke-[#d9dde0]" strokeWidth="0.8" />
          <path d="M6 32 L3 25 M3 25 L1 23 M3 25 L5 22 M34 32 L37 25 M37 25 L39 23 M37 25 L35 22" className="stroke-[#4b6b4f]" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
