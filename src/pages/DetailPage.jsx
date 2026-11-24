import { Link, useParams } from "react-router-dom";
import { getPage } from "../services/api";
import { findSign } from "../config/signs";
import { useFetch } from "../hooks/useFetch";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import InfoTable from "../components/InfoTable";
import WikiImage from "../components/WikiImage";
import Button from "../components/Button";
import CastingArea from "../components/CastingArea";

const WEAKNESS = /susceptib|weak|vulnerab/i;

/** Split a monster's "Susceptibility" fact into short chips. */
function weaknessChips(facts) {
  const fact = facts.find((f) => WEAKNESS.test(f.label));
  if (!fact) return [];
  return fact.value
    .split(/[,;]|\band\b/)
    .map((s) => s.trim().replace(/^((very|highly|susceptible to|vulnerable to|sensitive to)\s+)+/i, "").trim())
    .filter((s) => s.length > 2 && s.length < 40)
    .slice(0, 8);
}

/** Shown when the wiki has no page with this title. */
function NotFound({ title, back }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-display text-2xl text-silver">No trace of “{title}”.</p>
      <p className="mt-3 text-steel">Not even a witcher’s medallion can find this page on the wiki.</p>
      <Button to={back.path} className="mt-6">
        Back to {back.label}
      </Button>
    </div>
  );
}

/** One wiki article: image, infobox facts and text. Shared by every section. */
export default function DetailPage({ section }) {
  const { title } = useParams();
  const { data, loading, error, retry } = useFetch((signal) => getPage(title, { signal }), [title]);
  useDocumentTitle(data?.title ?? title);

  const back = { path: section.backPath ?? section.path, label: section.label };

  if (loading) return <Loader label={`Reading about ${title}…`} />;
  if (error?.code === "missingtitle") return <NotFound title={title} back={back} />;
  if (error) return <ErrorMessage message={error.message} onRetry={retry} />;

  const sign = section.key === "signs" ? findSign(data.title) : null;
  const chips = section.key === "monsters" ? weaknessChips(data.facts) : [];
  const parchment = section.key === "monsters";

  return (
    <article className="motion-safe:animate-fade-in">
      <Link to={back.path} className="mb-6 inline-block text-sm text-steel hover:text-gold">
        ← Back to {back.label}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <aside className="space-y-6">
          <WikiImage
            src={data.image}
            alt={data.title}
            className={`max-h-[32rem] w-full rounded-lg border object-contain ${parchment ? "border-[#bfa878] bg-parchment" : "border-steel/20 bg-ash"}`}
          />
          <InfoTable facts={data.facts} />
        </aside>

        <div>
          <h1 className={`font-display text-4xl font-bold tracking-wide sm:text-5xl ${parchment ? "text-parchment" : "text-silver"}`}>
            {data.title}
          </h1>

          {chips.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-display text-xs uppercase tracking-widest text-steel">Weak to</p>
              <ul className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li key={c} className="rounded-full border border-blood bg-blood/20 px-3 py-1 text-sm text-silver">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            {sign && <CastingArea sign={sign} />}

            {data.sections.length === 0 && (
              <p className="text-steel">The wiki has no text for this page yet.</p>
            )}
            {data.sections.map((s, i) => (
              <section key={`${s.heading}-${i}`} className="mb-6">
                {s.heading && (
                  <h2 className="mb-3 border-b border-steel/20 pb-1 font-display text-2xl text-gold">{s.heading}</h2>
                )}
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="mb-3 leading-relaxed text-silver/90">
                    {p}
                  </p>
                ))}
              </section>
            ))}
            <a
              href={`https://witcher.fandom.com/wiki/${encodeURIComponent(data.title.replace(/ /g, "_"))}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-steel underline-offset-2 hover:text-gold hover:underline"
            >
              Read the full article on the Witcher Wiki ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
