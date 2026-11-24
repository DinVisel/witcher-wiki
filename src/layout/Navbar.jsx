import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_SECTIONS } from "../config/sections";
import Medallion from "../components/Medallion";
import MuteButton from "../components/MuteButton";

const LINKS = [
  { label: "Home", path: "/home" },
  { label: "Story", path: "/story" },
  ...NAV_SECTIONS.map((s) => ({ label: s.label, path: s.path })),
  { label: "Search", path: "/search" },
];

function linkClass({ isActive }) {
  return `rounded px-3 py-2 font-display text-sm tracking-wider transition ${
    isActive ? "bg-silver/10 text-gold" : "text-steel hover:text-silver"
  }`;
}

/** Top navigation: logo, section links, mute toggle and a mobile menu. */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const muteButton = <MuteButton />;

  return (
    <header className="sticky top-0 z-40 border-b border-blood/30 bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link to="/" className="flex items-center gap-3" title="Back to the welcome page">
          <Medallion className="size-9" />
          <span className="font-display text-lg font-bold tracking-widest text-silver">
            Witcher<span className="text-gold">Wiki</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.path} to={l.path} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {muteButton}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          {muteButton}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="rounded p-2 text-steel hover:bg-silver/10 hover:text-silver"
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
