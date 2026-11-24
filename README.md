# Witcher Wiki

A fan-made wiki of **The Witcher** — characters, bestiary, signs, locations and the story of the Continent — built with React and Tailwind CSS for a web development midterm.

- **Live:** https://witcher-wiki-eight.vercel.app/
- **Repo:** https://github.com/DinVisel/witcher-wiki

<!-- Add 1–2 screenshots or a GIF of casting Igni here. -->

## Features

**Required**
- Home page (`/home`) with an intro to the Witcher world and links to every section.
- Listing pages: **Characters**, **Bestiary**, **Signs** and **Locations**, each with **Load more** (MediaWiki continuation tokens).
- Detail page for every item via dynamic routes (`/monsters/:title`, `/characters/:title`, …).
- Live **name filter** on every listing, **monster class filter** (`?class=Necrophages`), **book filter** for characters (`?book=Blood of Elves`) and **location type** (`?type=Islands`), all kept in the URL.
- **Global search** across the whole wiki (`/search?q=griffin`, debounced).
- Loading indicator, readable errors and a **Retry** button on every data view.
- Navbar (with mobile menu) + footer, one consistent dark theme, responsive from 375 px up.

**Extras**
- **Welcome scene** (`/`): deep red backdrop with a curved red-and-gold ornament band, a canvas wall of fire with drifting embers and a flickering burning title. "Enter" plays a fanfare, lifts the band away and the home page **burns into view** (a noise-based dissolve on `<canvas>`). The same red backdrop is used on every page.
- **Book-themed home**: the intro is written in an open leather-bound book, the sections are tomes on a shelf, and the contract of the day is a notice pinned with a wax seal.
- **Cast the signs**: Igni (canvas fire particles + flash), Aard (shockwave rings + card shake), Quen (shield bubble, cast again to dismiss), Yrden (spinning rune trap), Axii (hypnotic rings + blur).
- **Sound effects** for every sign and the welcome fanfare, with a global mute toggle remembered in `localStorage`.
- **Keyboard shortcuts** 1–5 cast the signs on the Signs page.
- **Storyline** timeline from the Conjunction of the Spheres to the Wild Hunt; summaries and images come from the wiki, chapters fade in on scroll.
- Themed pages: parchment **Bestiary** with "Weak to" chips on monster pages, glowing rune panel for **Signs**.
- **Contract of the day** on the home page (same monster for everyone all day).
- Swinging wolf-medallion loader and a custom 404 ("You've strayed from the Path").
- Accessibility: `prefers-reduced-motion` fallbacks, aria labels on cast buttons, skip link, visible focus styles.

## Tech stack

React 19 (function components + hooks) · Vite · Tailwind CSS v4 · React Router v7 · `fetch`. No other UI, styling or animation libraries.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint     # oxlint
npm run sounds   # regenerate the sign and welcome sounds (optional)
```

## Testing

Manual test pass on the dev server and the live Vercel deploy (Chrome, desktop and 375 px phone width). `npm run lint` reports 0 warnings and `npm run build` succeeds.

| Area | What was checked | Result |
|---|---|---|
| Welcome → Home | Enter plays the fanfare, the ornament band lifts away, home burns into view; sound keeps playing after the route change and ends with the burn; refresh on `/home` does not replay it | ✅ |
| Navigation | Every navbar link incl. Home, active link highlight, mobile menu opens and closes after navigating, logo → Home | ✅ |
| Listings | Bestiary "Load more" appends (21 → 45), button hides at the end of a list (Necrophages, 21 items) | ✅ |
| Search & filters | Name filter reacts while typing ("grif" → Archgriffin); class / book / location chips reset the list and survive refresh (`?class=Necrophages`); global search keeps `?q=` in the URL and skips disambiguation pages | ✅ |
| Detail pages | Monster (image, infobox, "Weak to" chips, sections), sign (casting area), search result via `/wiki/:title` | ✅ |
| Not found | `/monsters/NotARealMonster` shows a friendly message; `/abc` shows the 404 page | ✅ |
| Errors | Simulated offline: readable error + Retry; Retry recovers once online | ✅ |
| Sign effects | Keys 1–5 and Cast buttons for all five signs; Quen toggles off; Igni's canvas is removed after the effect | ✅ |
| Deploy | Direct load + refresh of deep links (`/monsters/Drowner`), sounds and favicon served by Vercel; no console errors | ✅ |
| Responsive | 375 px: no horizontal scroll on Welcome, Home, Characters | ✅ |
| Accessibility | `prefers-reduced-motion`: static fire glow, fade instead of burn; aria labels on cast/mute/menu buttons; skip link | ✅ |
| Data quality | Checked image/summary coverage per category against the live API; cards with images are shown first, and Locations uses the best-covered categories | ✅ |

**Bugs found and fixed while testing**
- Two wiki titles that redirect to the same page produced duplicate cards and a React "same key" warning; previews are now de-duplicated after following redirects.
- In current Chromium `window.scrollTo()` returns a Promise; returning it from a `useEffect` crashed React ("destroy is not a function"). Fixed by not returning it.
- The plan's `prop=extracts` doesn't exist on Fandom; summaries come from `pageprops.fandomdescription` instead.
- `Category:Bestiary` and `Category:Characters` are empty on the wiki; switched to `The Witcher 3 bestiary` and per-book character categories.
- The original Locations category had images for only 6 of 24 items; replaced with better-covered categories and filter chips.

## Project structure

```
src/
├── services/api.js      every API call + response parsing
├── hooks/               useFetch, usePagedList, useDebounce, useSound, useSignCasting, useFilterParam, useInView, …
├── context/             SoundContext (global mute)
├── layout/              Layout, Navbar, Footer
├── components/          ItemCard, ItemGrid, ListingView, SearchBar, FilterChips, Loader, ErrorMessage, …
│   └── effects/         SignEffect + Igni/Aard/Quen/Yrden/Axii effects
├── pages/               Home, Story, Characters, Monsters, Signs, Locations, Detail, Search, NotFound
├── config/              sections, signs, storyline (small config only — content comes from the API)
├── App.jsx              routes
└── index.css            Tailwind import + @theme (colours, fonts, keyframes)
scripts/generate-sounds.mjs   synthesises the five sign sounds into public/sounds
```

## Data source

[Witcher Fandom wiki](https://witcher.fandom.com/) via its public MediaWiki API (`https://witcher.fandom.com/api.php`, CORS via `origin=*`).

| Use | Example |
|---|---|
| Listing | `action=query&list=categorymembers&cmtitle=Category:Signs&cmlimit=24` |
| Card previews | `action=query&titles=Igni\|Aard&prop=pageimages\|pageprops&ppprop=fandomdescription` |
| Detail page | `action=parse&page=Drowner&prop=text` (HTML is parsed into plain data, never injected) |
| Search | `action=query&list=search&srsearch=griffin` |

## Credits

- Text and images: [Witcher Wiki](https://witcher.fandom.com/) contributors, **CC BY-SA**.
- Sounds (signs + welcome fanfare): synthesised for this project by `scripts/generate-sounds.mjs` (original, no third-party audio).
- Fonts: Cinzel and Inter from Google Fonts (SIL Open Font License).

Fan project, not affiliated with CD PROJEKT RED or Netflix.
