import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSound } from "../hooks/useSound";
import { useTimeout } from "../hooks/useTimeout";
import Curtains from "../components/Curtains";
import FireCanvas from "../components/effects/FireCanvas";
import Medallion from "../components/Medallion";
import MuteButton from "../components/MuteButton";

/** Fanfare played on Enter. Replace the file in public/sounds to use your own. */
const WELCOME_SOUND = "welcome.wav";

/**
 * The opening scene: red stage curtains, a wall of fire and a burning title.
 * "Enter" plays the fanfare, opens the curtains and the home page burns into view.
 */
export default function WelcomePage() {
  useDocumentTitle(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const play = useSound(0.8);
  const [entering, setEntering] = useState(false);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    play(WELCOME_SOUND);
  };

  // Hand over to the home page, which finishes the transition with BurnReveal.
  useTimeout(() => navigate("/home", { state: { entered: true } }), entering ? (reduced ? 150 : 1100) : null);

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-velvet-dark">
      <div aria-hidden="true" className="absolute inset-0 bg-radial-[at_50%_65%] from-blood/60 via-velvet-dark to-ink" />
      <FireCanvas flare={entering} />
      <Curtains open={entering} width="w-[14%] sm:w-[22%]" />

      <div className="absolute right-3 top-3 z-20 sm:right-5 sm:top-5">
        <MuteButton className="bg-ink/50 text-parchment" />
      </div>

      <main
        className={`relative z-10 flex min-h-dvh flex-col items-center justify-center px-12 py-24 text-center transition duration-1000 sm:px-6 ${
          entering ? "scale-110 opacity-0 blur-sm" : ""
        }`}
      >
        <Medallion className="size-20 origin-top motion-safe:animate-medallion sm:size-24" />
        <p className="mt-8 font-display text-[10px] tracking-[0.5em] text-gold/90 motion-safe:animate-rise-in sm:text-xs">
          Chronicles of the Continent
        </p>
        <h1 className="mt-3 bg-linear-to-t from-igni via-quen to-parchment bg-clip-text font-display text-4xl font-black leading-tight tracking-wide text-transparent motion-safe:animate-flicker sm:text-7xl">
          The Witcher Wiki
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-parchment/80 motion-safe:animate-rise-in motion-safe:[animation-delay:300ms] sm:text-base">
          Monsters, mages and the men who hunt them. Draw your silver sword — the Path begins here.
        </p>
        <button
          type="button"
          autoFocus
          onClick={enter}
          className="group relative mt-10 rounded-sm border-2 border-gold/80 bg-linear-to-b from-velvet to-velvet-dark px-8 py-3 font-display text-sm font-bold tracking-[0.3em] text-parchment shadow-[0_0_30px_rgb(255_106_26/0.35)] transition hover:shadow-[0_0_45px_rgb(255_106_26/0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-quen motion-safe:animate-rise-in motion-safe:[animation-delay:600ms] sm:text-base"
        >
          <span className="absolute inset-1 border border-gold/30" aria-hidden="true" />
          Enter the Continent
        </button>
        <p className="mt-4 text-xs text-parchment/50">Sound on · press Enter</p>
      </main>

      <p className="absolute inset-x-0 bottom-3 z-10 px-4 text-center text-[11px] text-parchment/50">
        Content from the Witcher Wiki (Fandom), CC BY-SA. Fan project, not affiliated with CD PROJEKT RED or Netflix.
      </p>
    </div>
  );
}
