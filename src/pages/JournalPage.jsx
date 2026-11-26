import { ACHIEVEMENTS, CLUES } from "../config/achievements";
import { useJournal } from "../hooks/useJournal";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";

/** The Witcher's Journal: every fan easter egg and puzzle, found or still hidden. */
export default function JournalPage() {
  useDocumentTitle("Journal");
  const { unlocked, clues, reset } = useJournal();

  return (
    <div>
      <PageHeader
        title="Witcher's Journal"
        subtitle="Little secrets and trials hidden around the wiki. Your progress is saved in this browser."
      >
        <p className="font-display text-lg text-gold">
          {unlocked.length} / {ACHIEVEMENTS.length} entries
        </p>
      </PageHeader>

      <ul className="grid gap-5 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const done = unlocked.includes(a.id);
          return (
            <li
              key={a.id}
              className={`relative rounded-md border p-5 transition ${
                done
                  ? "border-[#bfa878] bg-parchment text-ink shadow-[inset_0_0_40px_rgb(120_80_30/0.3)]"
                  : "border-steel/25 bg-ink/50 text-steel"
              }`}
            >
              <p className={`font-display text-[10px] uppercase tracking-[0.3em] ${done ? "text-blood" : "text-steel/70"}`}>
                {done ? "Entry written" : "Not yet discovered"}
              </p>
              <h2 className={`mt-1 font-display text-xl font-bold ${done ? "text-blood" : "text-parchment/60"}`}>
                {done ? a.title : "? ? ?"}
              </h2>
              <p className={`mt-2 text-sm ${done ? "text-ink/80" : "italic"}`}>{done ? a.text : `Hint: ${a.hint}`}</p>
              {a.id === "senses" && !done && (
                <p className="mt-2 text-xs">
                  Clues followed: {clues.length} / {CLUES.length} (
                  {CLUES.map((c) => `${c.where}${clues.includes(c.id) ? " ✓" : ""}`).join(", ")})
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex justify-center">
        <Button variant="ghost" onClick={reset} disabled={!unlocked.length && !clues.length}>
          Start a new journal
        </Button>
      </div>
    </div>
  );
}
