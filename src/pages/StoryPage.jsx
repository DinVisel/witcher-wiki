import { getPreviews } from "../services/api";
import { STORYLINE } from "../config/storyline";
import { useFetch } from "../hooks/useFetch";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import StoryChapter from "../components/StoryChapter";

const TITLES = STORYLINE.map((c) => c.title);

/** The storyline timeline: from the Conjunction of the Spheres to the Wild Hunt. */
export default function StoryPage() {
  useDocumentTitle("The Story");
  // One request for every chapter's summary and image.
  const { data, loading, error, retry } = useFetch((signal) => getPreviews(TITLES, { signal }), []);

  return (
    <div>
      <PageHeader
        title="The Story of the Continent"
        subtitle="From the night the spheres collided to the riders of the Wild Hunt — the saga in eleven chapters."
      />
      {loading && <Loader label="Unrolling the scrolls…" />}
      {error && <ErrorMessage message={error.message} onRetry={retry} />}
      {data && (
        <ol className="relative space-y-10 before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-linear-to-b before:from-gold/0 before:via-gold/60 before:to-gold/0 md:before:left-1/2">
          {STORYLINE.map((chapter, i) => (
            <StoryChapter
              key={chapter.title}
              chapter={chapter}
              index={i}
              preview={data.find((p) => p.title === chapter.title)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
