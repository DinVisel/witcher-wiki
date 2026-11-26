// Roach, Geralt's horse, as an original inline-SVG mascot (side view, facing right).
// With `rider`, the witcher sits in the saddle. With `galloping`, the body bobs
// and the legs swing (Tailwind keyframes from index.css; off with reduced motion).

const COAT = "fill-[#7a4a2a]";
const DARK = "fill-[#2b1a12]";
const HOOF = "fill-[#1a110c]";

/** One leg, rotating around its top (the hip/shoulder) while galloping. */
function Leg({ x, far, swing, galloping }) {
  return (
    <g
      className={`origin-top [transform-box:fill-box] ${galloping ? swing : ""}`}
    >
      <rect x={x} y="56" width="7" height="32" rx="3" className={far ? "fill-[#5e3820]" : COAT} />
      <rect x={x - 0.5} y="85" width="8" height="5" rx="1.5" className={HOOF} />
    </g>
  );
}

/** The witcher in the saddle: white hair, dark armour, two swords, wolf medallion. */
function Rider() {
  return (
    <g className="motion-safe:animate-fade-in">
      {/* swords crossed on the back */}
      <path d="M46 2 L70 -26" className="stroke-steel" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 -4 L62 -30" className="stroke-silver" strokeWidth="2" strokeLinecap="round" />
      {/* leg over the horse's side */}
      <path d="M54 30 L60 48 L66 48 L62 30Z" className="fill-ink" />
      <rect x="58" y="46" width="9" height="4" rx="1.5" className={HOOF} />
      {/* torso */}
      <path d="M50 -2 L66 -2 L68 30 L48 30Z" className="fill-ash stroke-ink" strokeWidth="1" />
      <path d="M49 18 L67 18" className="stroke-[#5e3820]" strokeWidth="3" />
      <circle cx="58" cy="7" r="2.6" className="fill-gold" />
      {/* arm holding the reins */}
      <path d="M64 4 L78 18 L92 22" className="fill-none stroke-ash" strokeWidth="4" strokeLinecap="round" />
      <path d="M92 22 L100 18" className="fill-none stroke-[#2b1a12]" strokeWidth="1" />
      {/* head and white hair with a ponytail */}
      <circle cx="58" cy="-10" r="7" className="fill-[#e8c9a8]" />
      <path d="M50 -10 C50 -20 66 -21 66 -12 L64 -14 C60 -17 55 -17 52 -12 L52 -2 L49 -4Z" className="fill-silver" />
      <path d="M50 -9 C45 -8 44 -2 46 2 C48 -2 49 -5 52 -7Z" className="fill-silver" />
      <circle cx="61" cy="-10" r="0.9" className="fill-quen" />
    </g>
  );
}

/** Roach the horse. `className` sets the size (the SVG keeps its aspect ratio). */
export default function Roach({ rider = false, galloping = false, className = "w-24" }) {
  return (
    <svg viewBox="0 -34 124 128" className={className} aria-hidden="true">
      <g className={galloping ? "motion-safe:animate-gallop" : ""}>
        {/* far legs and tail behind the body */}
        <Leg x={26} far swing="motion-safe:animate-leg-back" galloping={galloping} />
        <Leg x={80} far swing="motion-safe:animate-leg-front" galloping={galloping} />
        <path d="M22 40 C6 44 2 64 10 80 C14 66 16 54 26 48Z" className={DARK} />

        {/* body, neck and head */}
        <ellipse cx="58" cy="50" rx="37" ry="17" className={COAT} />
        <path d="M80 42 L96 14 L108 20 L96 54Z" className={COAT} />
        <path d="M96 12 C104 6 115 12 118 22 L112 29 C107 27 101 26 96 24Z" className={COAT} />
        <path d="M112 22 L118 22 L116 28 L111 28Z" className="fill-[#5e3820]" />
        <path d="M98 10 L100 2 L104 10Z" className={COAT} />
        <circle cx="106" cy="16" r="1.4" className="fill-ink" />
        {/* dark mane along the neck */}
        <path d="M96 11 C88 18 83 30 79 42 L85 41 C89 30 93 21 100 14Z" className={DARK} />
        {/* bridle and reins */}
        <path d="M100 13 L112 25 M98 22 L108 27" className="fill-none stroke-[#3a0507]" strokeWidth="1.2" />

        {/* saddle blanket and saddle */}
        <path d="M44 34 L72 34 L74 50 L42 50Z" className="fill-velvet" />
        <path d="M44 34 L72 34" className="stroke-gold" strokeWidth="1.2" />
        <path d="M48 32 C52 26 66 26 70 32 L68 37 L50 37Z" className="fill-[#3a0507] stroke-gold" strokeWidth="0.8" />

        {/* near legs in front of the body */}
        <Leg x={34} swing="motion-safe:animate-leg-front" galloping={galloping} />
        <Leg x={88} swing="motion-safe:animate-leg-back" galloping={galloping} />

        {rider && <Rider />}
      </g>
    </svg>
  );
}
