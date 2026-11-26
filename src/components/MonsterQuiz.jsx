import { useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryPage, getPreviews } from "../services/api";
import { itemPath, MONSTER_CLASSES, SECTIONS } from "../config/sections";
import { useFetch } from "../hooks/useFetch";
import { useJournal } from "../hooks/useJournal";
import WikiImage from "./WikiImage";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const STREAK_GOAL = 3;
const CLASSES = MONSTER_CLASSES.filter((c) => c.value); // without "All"

/** Pick n different random items. */
function pickRandom(list, n) {
  return [...list].sort(() => Math.random() - 0.5).slice(0, n);
}

/**
 * Build one question from live wiki data: 4 random monster classes, a random
 * monster from one of them (not the class's own overview page), and its picture.
 */
async function fetchQuestion(signal) {
  const options = pickRandom(CLASSES, 4);
  const answer = Math.floor(Math.random() * options.length);
  const { titles } = await getCategoryPage(options[answer].category, null, { signal });
  // Skip the class's own overview page (e.g. "Vampire" inside "Vampires").
  const candidates = titles.filter((t) => !options[answer].label.toLowerCase().startsWith(t.toLowerCase()));
  const title = candidates[Math.floor(Math.random() * candidates.length)] ?? titles[0];
  const [preview] = await getPreviews([title], { signal });
  return { monster: preview ?? { title, image: null }, options: options.map((o) => o.label), answer };
}

/**
 * "Prepare for the contract": name the class of a monster from the Bestiary.
 * Questions come from the API each round; 3 correct in a row → Journal entry.
 */
export default function MonsterQuiz() {
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState(null);
  const [streak, setStreak] = useState(0);
  const { unlock } = useJournal();
  const { data, loading, error, retry } = useFetch((signal) => (open ? fetchQuestion(signal) : Promise.resolve(null)), [open, round]);

  const answer = (i) => {
    if (choice !== null || !data) return;
    setChoice(i);
    const next = i === data.answer ? streak + 1 : 0;
    setStreak(next);
    if (next >= STREAK_GOAL) unlock("quiz");
  };

  const nextQuestion = () => {
    setChoice(null);
    setRound((r) => r + 1);
  };

  return (
    <section aria-labelledby="quiz-heading" className="mb-8 rounded-lg border border-[#bfa878]/50 bg-ink/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span id="quiz-heading" className="font-display text-lg font-bold tracking-wide text-parchment">
          Prepare for the contract
        </span>
        <span className="text-xs text-steel">{open ? "Hide" : "Can you name the monster's class?"}</span>
      </button>

      {open && (
        <div className="border-t border-[#bfa878]/30 px-4 pb-5 pt-4">
          <p className="mb-4 text-sm text-parchment/80">
            Streak: <span className="font-bold text-gold">{streak}</span> / {STREAK_GOAL}
          </p>
          {loading && <Loader label="Reading the bestiary…" />}
          {error && <ErrorMessage message={error.message} onRetry={retry} />}
          {data && (
            <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
              <WikiImage src={data.monster.image} alt="" className="aspect-square w-40 rounded-md border border-[#bfa878] bg-parchment sepia-[.3]" />
              <div>
                <p className="font-display text-xl text-parchment">
                  Which class is the <span className="text-gold">{data.monster.title}</span>?
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {data.options.map((label, i) => {
                    const revealed = choice !== null;
                    const right = i === data.answer;
                    const style = !revealed
                      ? "border-steel/40 text-silver hover:border-gold hover:text-gold"
                      : right
                        ? "border-gold bg-gold/20 text-gold"
                        : i === choice
                          ? "border-blood bg-blood/30 text-parchment"
                          : "border-steel/20 text-steel/60";
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => answer(i)}
                        disabled={revealed}
                        className={`rounded-md border px-3 py-2 text-left text-sm transition ${style}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {choice !== null && (
                  <div role="status" className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className={choice === data.answer ? "text-gold" : "text-parchment"}>
                      {choice === data.answer ? "Correct — well prepared, witcher." : `Not quite — it's one of the ${data.options[data.answer]}.`}
                    </span>
                    <Link to={itemPath(SECTIONS.monsters, data.monster.title)} className="text-steel underline-offset-2 hover:text-gold hover:underline">
                      Read the entry
                    </Link>
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="rounded-sm border border-gold/70 px-3 py-1 font-display text-xs tracking-widest text-gold transition hover:bg-gold/15"
                    >
                      Next monster
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
