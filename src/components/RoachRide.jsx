import { useIsScrolling } from "../hooks/useIsScrolling";
import Roach from "./mascots/Roach";
import Geralt from "./mascots/Geralt";

/**
 * Roach and Geralt on the storyline. Sits on the timeline line (absolute,
 * full height of the timeline). Before mounting: Roach waits at the top with
 * Geralt beside her and a "Jump on Roach" button. Mounted: the rider becomes
 * CSS-sticky, so it travels down the line with the scroll, galloping while the
 * page moves. No positions are computed in JS — sticky positioning does it.
 *
 * Props: stage ("idle" | "jumping" | "riding"), onJump, onDismount.
 */
export default function RoachRide({ stage, onJump, onDismount }) {
  const riding = stage === "riding";
  const galloping = useIsScrolling(riding);

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 md:left-1/2 md:w-24 md:-translate-x-1/2">
      <div className={riding ? "sticky top-[42vh]" : "relative"}>
        <div className="relative">
          <Roach rider={riding} galloping={galloping} className="w-10 drop-shadow-[0_6px_6px_rgb(0_0_0/0.6)] md:w-24" />

          {/* Geralt waits beside Roach, then jumps into the saddle */}
          {!riding && (
            <div className="absolute bottom-1 left-full ml-1 md:left-auto md:right-full md:mr-1">
              <Geralt
                className={`w-5 md:w-10 ${stage === "jumping" ? "motion-safe:animate-jump-on motion-reduce:opacity-0" : ""}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* the call to action sits under the waiting horse */}
      <div className="pointer-events-auto absolute left-0 top-16 flex w-max flex-col items-start gap-1 md:left-1/2 md:top-28 md:-translate-x-1/2 md:items-center">
        {riding ? (
          <>
            <button
              type="button"
              onClick={onDismount}
              className="rounded-sm border border-gold/60 bg-ink/80 px-3 py-1 font-display text-xs tracking-widest text-gold transition hover:bg-gold/15"
            >
              Dismount
            </button>
            <p className="text-xs text-parchment/70">Scroll — Roach carries you through the story.</p>
          </>
        ) : (
          <button
            type="button"
            onClick={onJump}
            disabled={stage === "jumping"}
            className="rounded-sm border-2 border-gold/80 bg-linear-to-b from-velvet to-velvet-dark px-4 py-2 font-display text-sm font-bold tracking-[0.2em] text-parchment shadow-[0_0_24px_rgb(255_106_26/0.35)] transition hover:shadow-[0_0_36px_rgb(255_106_26/0.6)] disabled:opacity-70"
          >
            Jump on Roach
          </button>
        )}
      </div>
    </div>
  );
}
