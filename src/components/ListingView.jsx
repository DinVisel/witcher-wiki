import { useState } from "react";
import { usePagedList } from "../hooks/usePagedList";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import ItemGrid from "./ItemGrid";
import LoadMoreButton from "./LoadMoreButton";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

/**
 * The shared listing layout used by every section page:
 * PageHeader → SearchBar (filters loaded items by name) → [filters] → grid → Load more.
 */
export default function ListingView({
  section,
  category = section.category,
  title = section.label,
  subtitle = section.description,
  filters,
  renderItem,
  className = "",
}) {
  const { items, hasMore, loading, loadingMore, error, loadMore, retry } = usePagedList(category);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q ? items.filter((i) => i.title.toLowerCase().includes(q)) : items;

  return (
    <div className={className}>
      <PageHeader title={title} subtitle={subtitle}>
        <SearchBar value={query} onChange={setQuery} placeholder={`Filter ${section.label.toLowerCase()}…`} label={`Filter ${section.label} by name`} />
      </PageHeader>
      {filters}

      {loading && <Loader />}
      {!loading && (
        <>
          {items.length > 0 || !error ? (
            <ItemGrid
              items={visible}
              section={section}
              renderItem={renderItem}
              emptyText={q ? `Nothing named “${query}” here yet. Try Load more or the global search.` : "This page of the wiki is empty."}
            />
          ) : null}
          {error && <ErrorMessage message={error.message} onRetry={retry} />}
          {!error && <LoadMoreButton onClick={loadMore} loading={loadingMore} hasMore={hasMore} />}
        </>
      )}
    </div>
  );
}
