import { Link } from "react-router-dom";
import { NAV_SECTIONS } from "../config/sections";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Button from "../components/Button";
import Medallion from "../components/Medallion";
import ContractOfTheDay from "../components/ContractOfTheDay";

/** Small glyph per section card. */
const ICONS = {
  characters: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  monsters: "M4 18l3-9 3 4 2-7 2 7 3-4 3 9z",
  signs: "M12 3l8 15H4zM12 9v5",
  locations: "M12 21s-6-6-6-11a6 6 0 1112 0c0 5-6 11-6 11zm0-9a2 2 0 100-4 2 2 0 000 4z",
};

const EXTRA_LINKS = [
  { key: "story", label: "The Story", path: "/story", description: "The saga as a timeline, from the Conjunction to the Hunt.", icon: "M5 4h10l4 4v12H5zM9 12h6M9 16h6" },
  { key: "search", label: "Search", path: "/search", description: "Look up anything on the Witcher Wiki.", icon: "M11 18a7 7 0 100-14 7 7 0 000 14zm9 2l-4-4" },
];

/** Landing page: hero, links to every section and the contract of the day. */
export default function HomePage() {
  useDocumentTitle(null);
  const cards = [...NAV_SECTIONS.map((s) => ({ ...s, icon: ICONS[s.key] })), ...EXTRA_LINKS];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-xl border border-steel/20 bg-ash px-6 py-16 text-center sm:px-12">
        <div aria-hidden="true" className="absolute inset-0 bg-radial-[at_50%_0%] from-blood/30 via-transparent to-transparent" />
        <div className="relative">
          <Medallion className="mx-auto size-20 origin-top motion-safe:animate-medallion" />
          <h1 className="mt-6 font-display text-4xl font-black tracking-wide text-silver sm:text-6xl">
            The Continent Awaits
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-steel">
            Long ago the Conjunction of the Spheres trapped monsters in our world. To fight them, mages created
            witchers — mutated, sword-carrying hunters who walk the Path from contract to contract. Explore their
            world: the people of the saga, the beasts in the bestiary and the signs every witcher can cast.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/story">Begin the story</Button>
            <Button to="/monsters" variant="ghost">
              Open the bestiary
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="mb-6 font-display text-2xl font-bold text-silver">
          Explore
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.key}>
              <Link
                to={c.path}
                className="group flex h-full gap-4 rounded-lg border border-steel/20 bg-ash p-6 transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10"
              >
                <svg viewBox="0 0 24 24" className="size-10 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                  <path d={c.icon} />
                </svg>
                <div>
                  <h3 className="font-display text-xl font-semibold text-silver group-hover:text-gold">{c.label}</h3>
                  <p className="mt-1 text-sm text-steel">{c.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContractOfTheDay />
    </div>
  );
}
