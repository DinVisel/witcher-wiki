import { useEffect, useState } from "react";
import { SIGNS } from "../config/signs";
import { useSound } from "../hooks/useSound";
import { useTimeout } from "../hooks/useTimeout";
import { useJournal } from "../hooks/useJournal";

const GOAL = 5; // rounds to pass the trial
const STEP = 650; // ms per sign while showing the sequence

const randomSign = () => SIGNS[Math.floor(Math.random() * SIGNS.length)].name;

/**
 * Trial of the Signs: a memory puzzle. Watch a sequence of signs light up
 * (with their sounds), then repeat it. Each round adds one sign; pass round 5
 * to complete the trial (Journal entry).
 */
export default function SignTrial() {
  const [open, setOpen] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | showing | input | next | failed | won
  const [step, setStep] = useState(0); // showing: index being shown; input: index expected next
  const [lit, setLit] = useState(null); // { name, id } of the sign currently lit
  const play = useSound(0.5);
  const { unlock } = useJournal();

  // Play the sequence one sign at a time (all timers are cleared on cleanup).
  useEffect(() => {
    if (phase !== "showing") return undefined;
    const timers = sequence.flatMap((name, i) => [
      setTimeout(() => {
        setLit({ name, id: `s${i}` });
        play(SIGNS.find((s) => s.name === name).sound);
      }, 400 + i * STEP),
      setTimeout(() => setLit(null), 400 + i * STEP + STEP * 0.7),
    ]);
    timers.push(
      setTimeout(() => {
        setStep(0);
        setPhase("input");
      }, 400 + sequence.length * STEP),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, sequence, play]);

  // A short pause between rounds, then the longer sequence is shown.
  useTimeout(() => setPhase("showing"), phase === "next" ? 700 : null);
  // Turn off a sign the player pressed.
  useTimeout(() => setLit(null), lit && phase !== "showing" ? 250 : null);

  const start = () => {
    setSequence([randomSign()]);
    setPhase("showing");
  };

  const press = (name) => {
    if (phase !== "input") return;
    const sign = SIGNS.find((s) => s.name === name);
    play(sign.sound);
    setLit({ name, id: `p${Date.now()}` });
    if (name !== sequence[step]) {
      setPhase("failed");
      return;
    }
    if (step + 1 < sequence.length) {
      setStep(step + 1);
    } else if (sequence.length >= GOAL) {
      setPhase("won");
      unlock("trial");
    } else {
      setSequence([...sequence, randomSign()]);
      setPhase("next");
    }
  };

  const status = {
    idle: `Watch the signs light up, then repeat them. Pass ${GOAL} rounds.`,
    showing: `Round ${sequence.length} — watch closely…`,
    input: `Round ${sequence.length} — your turn (${step}/${sequence.length})`,
    next: "Correct! The next sequence is longer…",
    failed: `Wrong sign. You reached round ${sequence.length}.`,
    won: `Trial passed — ${GOAL} rounds without a mistake!`,
  }[phase];

  return (
    <section aria-labelledby="trial-heading" className="mb-8 rounded-lg border border-gold/30 bg-ink/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span id="trial-heading" className="font-display text-lg font-bold tracking-wide text-gold">
          Trial of the Signs
        </span>
        <span className="text-xs text-steel">{open ? "Hide" : "A memory puzzle — try it"}</span>
      </button>

      {open && (
        <div className="border-t border-gold/20 px-4 pb-5 pt-4">
          <p role="status" className="mb-4 text-sm text-parchment/85">
            {status}
          </p>
          <div className="flex flex-wrap gap-3">
            {SIGNS.map((s) => {
              const on = lit?.name === s.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => press(s.name)}
                  disabled={phase !== "input"}
                  aria-label={`${s.name}${on ? " (lit)" : ""}`}
                  className={`h-14 min-w-20 rounded-md border-2 bg-ink px-3 font-display text-sm font-bold tracking-widest transition duration-150 disabled:cursor-default ${s.border} ${s.text} ${
                    on ? `scale-110 shadow-[0_0_30px] ${s.glow} bg-silver/10` : "opacity-80"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          {(phase === "idle" || phase === "failed" || phase === "won") && (
            <button
              type="button"
              onClick={start}
              className="mt-5 rounded-sm border border-gold/70 px-4 py-1.5 font-display text-sm tracking-widest text-gold transition hover:bg-gold/15"
            >
              {phase === "idle" ? "Begin the trial" : "Try again"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
