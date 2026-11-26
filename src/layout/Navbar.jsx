import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_SECTIONS } from "../config/sections";
import { ACHIEVEMENTS } from "../config/achievements";
import { SensesContext } from "../context/SensesContext";
import { useJournal } from "../hooks/useJournal";
import Medallion from "../components/Medallion";
import MuteButton from "../components/MuteButton";

const LINKS = [
  { label: "Home", path: "/home" },
  { label: "Story", path: "/story" },
  ...NAV_SECTIONS.map((s) => ({ label: s.label, path: s.path })),
  { label: "Search", path: "/search" },
];

function linkClass({ isActive }) {
  return `rounded px-2.5 py-2 font-display text-sm tracking-wider transition xl:px-3 ${
    isActive ? "bg-silver/10 text-gold" : "text-steel hover:text-silver"
  }`;
}

const ICON_BUTTON = "relative rounded p-1.5 transition hover:bg-silver/10 sm:p-2";

/** Witcher Senses toggle, Journal link (with progress badge) and mute toggle. */
function NavTools() {
  const { on, toggle } = useContext(SensesContext);
  const { unlocked } = useJournal();
  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Turn off Witcher Senses" : "Use Witcher Senses"}
        title={on ? "Turn off Witcher Senses" : "Witcher Senses: reveal hidden clues"}
        className={`${ICON_BUTTON} ${on ? "text-[#ff2a2a]" : "text-steel hover:text-silver"}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" fill={on ? "currentColor" : "none"} />
        </svg>
      </button>
      <NavLink
        to="/journal"
        aria-label={`Journal: ${unlocked.length} of ${ACHIEVEMENTS.length} entries`}
        title="Witcher's Journal"
        className={({ isActive }) => `${ICON_BUTTON} ${isActive ? "text-gold" : "text-steel hover:text-silver"}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 4h11l3 3v13H5zM8 9h8M8 13h8M8 17h5" />
        </svg>
        {unlocked.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold leading-4 text-ink">
            {unlocked.length}
          </span>
        )}
      </NavLink>
      <MuteButton className="p-1.5 sm:p-2" />
    </>
  );
}

/** Top navigation: logo, section links, fan tools, mute toggle and a mobile menu. */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-blood/30 bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3" aria-label="Main">
        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3" title="Back to the welcome page">
          <Medallion className="size-8 sm:size-9" />
          <span className="font-display text-base font-bold tracking-widest text-silver sm:text-lg">
            Witcher<span className="text-gold">Wiki</span>
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.path} to={l.path} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <NavTools />
        </div>

        <div className="flex items-center gap-0.5 lg:hidden">
          <NavTools />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className={`${ICON_BUTTON} text-steel hover:text-silver`}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="flex flex-col gap-1 border-t border-steel/20 px-4 py-3 lg:hidden">
          {LINKS.map((l) => (
            <NavLink key={l.path} to={l.path} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
