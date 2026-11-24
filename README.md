# Witcher Wiki

A fan-made wiki of **The Witcher** — characters, bestiary, signs, locations and the story of the Continent — built with React and Tailwind CSS for a web development midterm.

- **Live:** _add your Vercel link here_
- **Repo:** _add your GitHub link here_

<!-- Add 1–2 screenshots or a GIF of casting Igni here. -->

## Features

**Required**
- Home page with an intro to the Witcher world and links to every section.
- Listing pages: **Characters**, **Bestiary**, **Signs** and **Locations**, each with **Load more** (MediaWiki continuation tokens).
- Detail page for every item via dynamic routes (`/monsters/:title`, `/characters/:title`, …).
- Live **name filter** on every listing, **monster class filter** (`?class=Necrophages`) and **book filter** for characters (`?book=Blood of Elves`) kept in the URL.
- **Global search** across the whole wiki (`/search?q=griffin`, debounced).
- Loading indicator, readable errors and a **Retry** button on every data view.
- Navbar (with mobile menu) + footer, one consistent dark theme, responsive from 375 px up.

**Extras**
- **Cast the signs**: Igni (canvas fire particles + flash), Aard (shockwave rings + card shake), Quen (shield bubble, cast again to dismiss), Yrden (spinning rune trap), Axii (hypnotic rings + blur).
- **Sound effects** for every sign, with a global mute toggle remembered in `localStorage`.
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
npm run sounds   # regenerate the sign sound effects (optional)
```

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
docs/                    implementation plan + per-phase progress notes
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
- Sounds: synthesised for this project by `scripts/generate-sounds.mjs` (original, no third-party audio).
- Fonts: Cinzel and Inter from Google Fonts (SIL Open Font License).

Fan project, not affiliated with CD PROJEKT RED or Netflix.
