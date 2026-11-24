import { CHARACTER_BOOKS, SECTIONS } from "../config/sections";
import { useFilterParam } from "../hooks/useFilterParam";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ListingView from "../components/ListingView";
import FilterChips from "../components/FilterChips";

/** Characters, filtered by the book of the saga they appear in (?book=). */
export default function CharactersPage() {
  useDocumentTitle("Characters");
  const { option, value, setValue } = useFilterParam("book", CHARACTER_BOOKS);

  return (
    <ListingView
      section={SECTIONS.characters}
      category={option.category}
      subtitle={`${SECTIONS.characters.description} Showing characters from “${option.label}”.`}
      filters={<FilterChips options={CHARACTER_BOOKS} value={value} onChange={setValue} label="Book" />}
    />
  );
}
