import { MONSTER_CLASSES, SECTIONS } from "../config/sections";
import { useFilterParam } from "../hooks/useFilterParam";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ListingView from "../components/ListingView";
import FilterChips from "../components/FilterChips";

/** The Bestiary: a parchment monster book, filterable by monster class (?class=). */
export default function MonstersPage() {
  useDocumentTitle("Bestiary");
  const { option, value, setValue } = useFilterParam("class", MONSTER_CLASSES);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-4 -top-8 h-64 bg-linear-to-b from-blood/15 to-transparent"
      />
      <ListingView
        className="relative"
        section={SECTIONS.monsters}
        category={option.category}
        title={value ? `Bestiary · ${option.label}` : "Bestiary"}
        filters={<FilterChips options={MONSTER_CLASSES} value={value} onChange={setValue} label="Monster class" />}
      />
    </div>
  );
}
