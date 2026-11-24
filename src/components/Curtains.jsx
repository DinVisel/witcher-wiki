// Red theatre curtains drawn with CSS gradients only.
const FOLDS =
  "bg-[repeating-linear-gradient(90deg,#2a0306_0px,#6b0d12_9px,#a3161c_18px,#c0242a_22px,#7a0d12_30px,#2a0306_40px)]";
const SWAGS =
  "bg-[radial-gradient(ellipse_at_50%_0%,#b81c23_0%,#7a0d12_45%,#3a0508_68%,transparent_70%)] bg-size-[140px_100%] bg-repeat-x";
const FRINGE = "bg-[repeating-linear-gradient(90deg,#c9a24a_0_3px,transparent_3px_7px)]";

/** One side drape, gathered by a tie-back (clip-path). Slides off-screen when `open`. */
function Drape({ side, open, sway, width, tieBack }) {
  const left = side === "left";
  return (
    <div
      className={`absolute inset-y-0 ${left ? "left-0" : "right-0"} ${width} transition-transform duration-[1400ms] ease-in-out ${
        open ? (left ? "-translate-x-full" : "translate-x-full") : ""
      }`}
    >
      <div
        className={`relative size-full origin-top ${sway ? "motion-safe:animate-sway" : ""} ${
          left
            ? "[clip-path:polygon(0_0,100%_0,58%_52%,88%_100%,0_100%)]"
            : "[clip-path:polygon(0_0,100%_0,100%_100%,12%_100%,42%_52%)] [animation-direction:reverse]"
        }`}
      >
        <div className={`size-full ${FOLDS}`} />
        {/* light falls from the stage: darker towards the floor */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
      </div>
      {tieBack && (
        <span
          className={`absolute top-[50%] h-3 w-1/2 rounded-full bg-linear-to-b from-quen to-gold shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${
            left ? "left-0" : "right-0"
          }`}
        />
      )}
    </div>
  );
}

/**
 * Decorative stage curtains: two drapes and an optional valance with gold fringe.
 * `open` slides the drapes away; `width` sets each drape's width.
 */
export default function Curtains({
  open = false,
  sway = true,
  valance = true,
  tieBacks = true,
  width = "w-[22%]",
  className = "absolute inset-0",
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      <Drape side="left" open={open} sway={sway} width={width} tieBack={tieBacks} />
      <Drape side="right" open={open} sway={sway} width={width} tieBack={tieBacks} />
      {valance && (
        <div
          className={`absolute inset-x-0 top-0 transition-transform duration-[1400ms] ease-in-out ${open ? "-translate-y-full" : ""}`}
        >
          <div className={`h-8 ${FOLDS} shadow-[0_6px_18px_rgba(0,0,0,0.7)] sm:h-10`} />
          <div className={`h-10 sm:h-12 ${SWAGS}`} />
          <div className={`-mt-3 h-2 opacity-80 ${FRINGE}`} />
        </div>
      )}
    </div>
  );
}
