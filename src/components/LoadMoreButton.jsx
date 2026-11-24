import Button from "./Button";

/** "Load more" button; hidden when there is nothing left to load. */
export default function LoadMoreButton({ onClick, loading, hasMore }) {
  if (!hasMore) return null;
  return (
    <div className="mt-10 flex justify-center">
      <Button variant="ghost" onClick={onClick} disabled={loading} aria-busy={loading}>
        {loading ? "Loading…" : "Load more"}
      </Button>
    </div>
  );
}
