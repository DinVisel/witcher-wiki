import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_SECTIONS } from "../config/sections";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Button from "../components/Button";
import Medallion from "../components/Medallion";
import Curtains from "../components/Curtains";
import OpenBook from "../components/OpenBook";
import BookCard from "../components/BookCard";
import ContractOfTheDay from "../components/ContractOfTheDay";
import BurnReveal from "../components/effects/BurnReveal";

/** Small glyph per section tome. */
const ICONS = {
  characters: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  monsters: "M4 18l3-9 3 4 2-7 2 7 3-4 3 9z",
  signs: "M12 3l8 15H4zM12 9v5",
  locations: "M12 21s-6-6-6-11a6 6 0 1112 0c0 5-6 11-6 11zm0-9a2 2 0 100-4 2 2 0 000 4z",
};

const EXTRA_BOOKS = [
  { key: "story", label: "The Story", path: "/story", description: "The saga as a timeline, from the Conjunction to the Hunt.", icon: "M5 4h10l4 4v12H5zM9 12h6M9 16h6" },
  { key: "search", label: "Search", path: "/search", description: "Look up anything on the Witcher Wiki.", icon: "M11 18a7 7 0 100-14 7 7 0 000 14zm9 2l-4-4" },
];

/** Gold flourish between headings and text. */
function Ornament({ className = "" }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-linear-to-r from-transparent to-current" />
      <span className="size-1.5 rotate-45 bg-current" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-current" />
    </div>
  );
}

/**
 * Home: a stage with red curtains, the intro written in an open book, the
 * sections as leather tomes and the contract of the day pinned below.
 * Arriving from the welcome page, the page burns into view (BurnReveal).
 */
export default function HomePage() {
  useDocumentTitle("Home");
  const { state } = useLocation();
  const navigate = useNavigate();
  const [burning, setBurning] = useState(Boolean(state?.entered));

  // Clear the history state so a refresh doesn't replay the transition.
  const revealDone = useCallback(() => {
    setBurning(false);
    navigate(".", { replace: true, state: null });
  }, [navigate]);

  const books = [...NAV_SECTIONS.map((s) => ({ ...s, icon: ICONS[s.key] })), ...EXTRA_BOOKS];

  return (
    <div className="space-y-20">
      {burning && <BurnReveal onDone={revealDone} />}

      {/* velvet backdrop behind the whole page */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-radial-[at_50%_0%] from-blood/35 via-velvet-dark/60 to-ink" />
      <Curtains className="fixed inset-0 -z-10 opacity-60" valance={false} tieBacks={false} width="w-[9%] xl:w-[14%]" />

      <section className="relative overflow-hidden rounded-xl border border-blood/40 bg-velvet-dark px-3 pb-14 pt-28 shadow-[inset_0_0_80px_rgb(0_0_0/0.8)] sm:px-10 sm:pt-32">
        <Curtains sway={false} width="w-[7%] sm:w-[10%]" />
        {/* stage spotlight */}
        <div aria-hidden="true" className="absolute inset-0 bg-radial-[at_50%_15%] from-quen/20 via-transparent to-transparent" />

        <OpenBook
          className="motion-safe:animate-rise-in"
          left={
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Medallion className="size-16 origin-top motion-safe:animate-medallion" />
              <p className="mt-5 font-display text-[10px] tracking-[0.45em] text-blood/80 sm:text-xs">Chronicles of the Continent</p>
              <h1 className="mt-2 font-display text-3xl font-black leading-tight text-blood sm:text-5xl">
                The Continent Awaits
              </h1>
              <Ornament className="mt-5 text-[#8a6f45]" />
              <p className="mt-5 font-display text-sm italic text-ink/70">
                Every contract begins with a single page.
              </p>
            </div>
          }
          right={
            <div className="flex h-full flex-col justify-center">
              <p className="leading-relaxed text-ink/85 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-blood">
                Long ago the Conjunction of the Spheres trapped monsters in our world. To fight them, mages created
                witchers — mutated, sword-carrying hunters who walk the Path from contract to contract.
              </p>
              <p className="mt-4 leading-relaxed text-ink/85">
                Turn these pages to meet the people of the saga, study the beasts of the bestiary and practise the
                signs every witcher can cast.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/story">Begin the story</Button>
                <Button to="/monsters" variant="ink">
                  Open the bestiary
                </Button>
              </div>
            </div>
          }
        />
      </section>

      <section aria-labelledby="library-heading">
        <div className="mb-10 text-center">
          <h2 id="library-heading" className="font-display text-3xl font-bold tracking-wide text-parchment">
            The Library
          </h2>
          <Ornament className="mt-3 text-gold/70" />
          <p className="mt-3 text-sm text-steel">Take a tome from the shelf.</p>
        </div>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <li key={b.key}>
              <BookCard to={b.path} title={b.label} description={b.description} icon={b.icon} />
            </li>
          ))}
        </ul>
      </section>

      <ContractOfTheDay />
    </div>
  );
}
