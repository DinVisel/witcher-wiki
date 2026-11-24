import { useCallback, useEffect, useRef, useState } from "react";
import { getCategoryPage, getPreviews } from "../services/api";

/** Rough "how complete is this card" score: image counts most, then summary. */
const richness = (item) => (item.image ? 2 : 0) + (item.summary ? 1 : 0);

/**
 * Fetch one chunk of a category: its titles, then their previews.
 * Within each chunk, cards with images and summaries come first (stable sort,
 * so the wiki's alphabetical order is kept inside each group).
 */
async function fetchChunk(category, cont, signal) {
  const { titles, next } = await getCategoryPage(category, cont, { signal });
  const items = await getPreviews(titles, { signal });
  return { items: items.toSorted((a, b) => richness(b) - richness(a)), next };
}

const EMPTY = { key: null, items: [], next: null, loadingMore: false, error: null };

/**
 * A category list with "Load more" based on the API's continuation token.
 * Resets whenever `category` changes (used by the filter chips).
 * Returns { items, hasMore, loading, loadingMore, error, loadMore, retry }.
 */
export function usePagedList(category) {
  const [attempt, setAttempt] = useState(0);
  const [list, setList] = useState(EMPTY);
  const key = `${category}#${attempt}`;
  const loading = list.key !== key;

  const controllerRef = useRef(null);
  const listRef = useRef(list);
  useEffect(() => {
    listRef.current = list;
  }, [list]);

  // First page; runs again when the category changes or on retry.
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    fetchChunk(category, null, controller.signal)
      .then(({ items, next }) => setList({ ...EMPTY, key, items, next }))
      .catch((error) => {
        if (error.name !== "AbortError") setList({ ...EMPTY, key, error });
      });
    return () => controller.abort();
  }, [category, key]);

  // Next page; appended to the current items (duplicates skipped).
  const loadMore = useCallback(() => {
    const { next, loadingMore, key: listKey } = listRef.current;
    if (!next || loadingMore) return;
    const { signal } = controllerRef.current;
    const update = (fn) => setList((s) => (s.key === listKey ? fn(s) : s)); // ignore if the list was reset
    update((s) => ({ ...s, loadingMore: true, error: null }));
    fetchChunk(category, next, signal)
      .then(({ items, next: following }) =>
        update((s) => {
          const known = new Set(s.items.map((i) => i.title));
          return {
            ...s,
            loadingMore: false,
            next: following,
            items: [...s.items, ...items.filter((i) => !known.has(i.title))],
          };
        }),
      )
      .catch((error) => {
        if (error.name !== "AbortError") update((s) => ({ ...s, loadingMore: false, error }));
      });
  }, [category]);

  // Retry the first page if nothing loaded yet, otherwise retry the failed "Load more".
  const retry = useCallback(() => {
    if (listRef.current.items.length) loadMore();
    else setAttempt((n) => n + 1);
  }, [loadMore]);

  return {
    items: loading ? [] : list.items,
    hasMore: !loading && Boolean(list.next),
    loading,
    loadingMore: list.loadingMore,
    error: loading ? null : list.error,
    loadMore,
    retry,
  };
}
