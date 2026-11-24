import Medallion from "./Medallion";

/** One half of the gold filigree; the other half is the same paths mirrored. */
function Scroll() {
  return (
    <g className="fill-none stroke-gold" strokeWidth="1.6" strokeLinecap="round">
      <path d="M128 36 C150 36 156 18 174 20 C192 22 190 44 174 44 C164 44 164 33 172 33" />
      <path d="M174 20 C206 12 232 34 262 30 C286 27 300 20 316 24" />
      <path d="M190 40 C214 50 236 42 252 46" className="stroke-gold/60" />
      <circle cx="320" cy="25" r="2.5" className="fill-gold stroke-none" />
    </g>
  );
}

/**
 * Ornamental band under the navbar: layered red curves swooping down to a
 * point in the middle, a gold line along the front curve and a filigree with
 * the wolf medallion. Fills the width of its parent, so place it outside the
 * page's max-width container. `medallion={false}` leaves just the filigree.
 */
export default function TopFlourish({ medallion = true, className = "" }) {
  return (
    <div aria-hidden="true" className={`relative w-full ${className}`}>
      <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="block h-28 w-full sm:h-40">
        <path
          className="fill-[#1a0204]"
          d="M0 0H1440V124C1320 166 1200 96 1080 114C960 132 840 176 720 160C600 176 480 132 360 114C240 96 120 166 0 124Z"
        />
        <path
          className="fill-velvet-dark"
          d="M0 0H1440V100C1260 142 1100 64 900 92C800 106 750 136 720 142C690 136 640 106 540 92C340 64 180 142 0 100Z"
        />
        <path
          className="fill-velvet"
          d="M0 0H1440V64C1240 104 1060 32 860 62C790 72 750 98 720 110C690 98 650 72 580 62C380 32 200 104 0 64Z"
        />
        <path className="fill-blood" d="M0 0H1440V30C1200 58 1000 14 720 40C440 14 240 58 0 30Z" />
        <path
          className="fill-none stroke-gold"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          d="M0 64C200 104 380 32 580 62C650 72 690 98 720 110C750 98 790 72 860 62C1060 32 1240 104 1440 64"
        />
        <path
          className="fill-none stroke-gold/40"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          d="M0 100C180 142 340 64 540 92C640 106 690 136 720 142C750 136 800 106 900 92C1100 64 1260 142 1440 100"
        />
      </svg>

      {/* filigree + medallion sitting on the point of the front curve */}
      <div className="absolute left-1/2 top-[34%] flex -translate-x-1/2 items-center sm:top-[38%]">
        <svg viewBox="0 0 640 60" className="h-8 w-[22rem] max-w-[92vw] sm:h-12 sm:w-[34rem]">
          <Scroll />
          <g transform="translate(640 0) scale(-1 1)">
            <Scroll />
          </g>
          <path d="M320 4 L330 30 L320 56 L310 30 Z" className="fill-velvet-dark stroke-gold" strokeWidth="1.5" />
        </svg>
        {medallion && (
          <Medallion className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_8px_rgb(0_0_0/0.6)] sm:size-16" />
        )}
      </div>
    </div>
  );
}
