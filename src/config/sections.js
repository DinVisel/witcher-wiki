// Single source of truth for the wiki's sections. Category names were checked
// against the live API in Phase 0 (see docs/phases/phase-0.md).

export const SECTIONS = {
  characters: {
    key: "characters",
    label: "Characters",
    path: "/characters",
    category: "Category:The Last Wish characters",
    variant: "steel",
    description: "Witchers, sorceresses, kings and rogues of the saga.",
  },
  monsters: {
    key: "monsters",
    label: "Bestiary",
    path: "/monsters",
    category: "Category:The Witcher 3 bestiary",
    variant: "parchment",
    description: "Every contract starts with knowing your foe.",
  },
  signs: {
    key: "signs",
    label: "Signs",
    path: "/signs",
    category: "Category:Signs",
    variant: "rune",
    description: "The simple magic of witchers. Try casting them.",
  },
  locations: {
    key: "locations",
    label: "Locations",
    path: "/locations",
    category: "Category:Locations",
    variant: "steel",
    description: "Castles, mines, markets and ruins of the Continent.",
  },
};

/** Generic section used for search results and storyline links. */
export const WIKI_SECTION = {
  key: "wiki",
  label: "Search",
  path: "/wiki",
  backPath: "/search",
  variant: "steel",
};

/** Sections in navbar order. */
export const NAV_SECTIONS = [SECTIONS.characters, SECTIONS.monsters, SECTIONS.signs, SECTIONS.locations];

/** Monster class filters → wiki categories. `value` is what goes in the URL (?class=). */
export const MONSTER_CLASSES = [
  { label: "All", value: "", category: SECTIONS.monsters.category },
  { label: "Necrophages", value: "Necrophages", category: "Category:Necrophages" },
  { label: "Specters", value: "Specters", category: "Category:Specters" },
  { label: "Relicts", value: "Relicts", category: "Category:Relicts" },
  { label: "Draconids", value: "Draconids", category: "Category:Draconids" },
  { label: "Hybrids", value: "Hybrids", category: "Category:Hybrids" },
  { label: "Insectoids", value: "Insectoids", category: "Category:Insectoids" },
  { label: "Cursed Ones", value: "Cursed Ones", category: "Category:Cursed Ones" },
  { label: "Ogroids", value: "Ogroids", category: "Category:Ogroids" },
  { label: "Elementa", value: "Elementa", category: "Category:Elementa" },
  { label: "Vampires", value: "Vampires", category: "Category:Vampires" },
  { label: "Beasts", value: "Beasts", category: "Category:Beasts" },
];

/** Character filters: one chip per book of the saga (?book=). */
export const CHARACTER_BOOKS = [
  { label: "The Last Wish", value: "", category: SECTIONS.characters.category },
  { label: "Sword of Destiny", value: "Sword of Destiny", category: "Category:Sword of Destiny characters" },
  { label: "Blood of Elves", value: "Blood of Elves", category: "Category:Blood of Elves characters" },
  { label: "Time of Contempt", value: "Time of Contempt", category: "Category:Time of Contempt characters" },
  { label: "Baptism of Fire", value: "Baptism of Fire", category: "Category:Baptism of Fire characters" },
  { label: "Tower of the Swallow", value: "The Tower of the Swallow", category: "Category:The Tower of the Swallow characters" },
  { label: "Lady of the Lake", value: "The Lady of the Lake", category: "Category:The Lady of the Lake characters" },
  { label: "Season of Storms", value: "Season of Storms", category: "Category:Season of Storms characters" },
];

/** Build the link to an item's detail page. */
export function itemPath(section, title) {
  return `${section.path}/${encodeURIComponent(title)}`;
}
