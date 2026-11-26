import { useRef, useState } from "react";
import { getPreviews } from "../services/api";
import { STORYLINE } from "../config/storyline";
import { useFetch } from "../hooks/useFetch";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSound } from "../hooks/useSound";
import { useTimeout } from "../hooks/useTimeout";
import { useActiveChild } from "../hooks/useActiveChild";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import StoryChapter from "../components/StoryChapter";
import RoachRide from "../components/RoachRide";

const TITLES = STORYLINE.map((c) => c.title);

/**
 * The storyline timeline: from the Conjunction of the Spheres to the Wild Hunt.
 * Geralt can jump on Roach, who then rides down the timeline as you scroll.
 */
export default function StoryPage() {
  useDocumentTitle("The Story");
  // One request for every chapter's summary and image.
  const { data, loading, error, retry } = useFetch((signal) => getPreviews(TITLES, { signal }), []);

  // "idle" → "jumping" (Geralt's leap, ~0.7 s) → "riding"
  const [stage, setStage] = useState("idle");
  // The chapter level with the riding mascot (it sticks at 42% of the screen height).
  const listRef = useRef(null);
  const active = useActiveChild(listRef, stage === "riding", 0.47);
  const reduced = useReducedMotion();
  const play = useSound(0.7);
  useTimeout(() => setStage("riding"), stage === "jumping" ? (reduced ? 50 : 700) : null);

  const jump = () => {
    setStage("jumping");
    play("hooves.wav");
  };

  return (
    <div>
      <PageHeader
        title="The Story of the Continent"
        subtitle="From the night the spheres collided to the riders of the Wild Hunt — the saga in eleven chapters."
      />
      {loading && <Loader label="Unrolling the scrolls…" />}
      {error && <ErrorMessage message={error.message} onRetry={retry} />}
      {data && (
        <div className="relative">
          <RoachRide stage={stage} onJump={jump} onDismount={() => setStage("idle")} />
          <ol
            ref={listRef}
            className="relative space-y-10 pt-36 before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-linear-to-b before:from-gold/0 before:via-gold/60 before:to-gold/0 md:pt-56 md:before:left-1/2"
          >
            {STORYLINE.map((chapter, i) => (
              <StoryChapter
                key={chapter.title}
                chapter={chapter}
                index={i}
                preview={data.find((p) => p.title === chapter.title)}
                here={active === i}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
