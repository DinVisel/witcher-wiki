import Button from "./Button";

/** A readable error with an optional Retry button. */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="mx-auto my-10 max-w-lg rounded-lg border border-blood/60 bg-blood/10 p-6 text-center"
    >
      <p className="font-display text-lg text-silver">The trail went cold.</p>
      <p className="mt-2 text-sm text-steel">
        {message || "Something went wrong while talking to the wiki."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Retry
        </Button>
      )}
    </div>
  );
}
