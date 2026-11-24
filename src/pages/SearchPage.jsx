import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPreviews, searchWiki } from "../services/api";
import { WIKI_SECTION } from "../config/sections";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ItemGrid from "../components/ItemGrid";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

/** Search titles, then load their previews for the cards. */
async function searchWithPreviews(query, signal) {
  if (!query) return [];
  const titles = await searchWiki(query, { signal });
  return getPreviews(titles, { signal });
}

/** Global search across the whole wiki. The query lives in the URL (?q=). */
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("q") ?? "");
  const query = useDebounce(input.trim(), 400);
  useDocumentTitle(query ? `Search: ${query}` : "Search");

  // Keep the URL in sync with the debounced query (replace, so Back isn't spammed).
  useEffect(() => {
    setParams(query ? { q: query } : {}, { replace: true });
  }, [query, setParams]);

  const { data, loading, error, retry } = useFetch((signal) => searchWithPreviews(query, signal), [query]);

  return (
    <div>
      <PageHeader title="Search the Continent" subtitle="Monsters, people, places, potions — anything on the Witcher Wiki.">
        <SearchBar value={input} onChange={setInput} placeholder="Try “griffin” or “Yennefer”" autoFocus />
      </PageHeader>

      {!query && (
        <p className="py-12 text-center font-display text-steel">Search the Continent…</p>
      )}
      {query && loading && <Loader label="Following the trail…" />}
      {query && error && <ErrorMessage message={error.message} onRetry={retry} />}
      {query && data && (
        <ItemGrid items={data} section={WIKI_SECTION} emptyText={`Nothing found for “${query}”.`} />
      )}
    </div>
  );
}
