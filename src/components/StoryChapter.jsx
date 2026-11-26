import { Link } from "react-router-dom";
import { itemPath, WIKI_SECTION } from "../config/sections";
import { useInView } from "../hooks/useInView";
import WikiImage from "./WikiImage";
import OpenBook from "./OpenBook";
import { toRoman } from "../utils/road";

/**
 * One timeline chapter drawn as an open book. Fades in when scrolled into view;
 * alternates sides on md+. `here` = Roach is riding past this book, which glows.
 */
export default function StoryChapter({ chapter, preview, index, here = false }) {
  const [ref, inView] = useInView();
  const right = index % 2 === 1;
  const title = preview?.title ?? chapter.title;

  return (
    <li
      ref={ref}
      className={`relative pl-16 transition-all duration-700 md:w-1/2 md:pl-0 ${
        right ? "md:ml-auto md:pl-24" : "md:pr-24"
      } ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0"}`}
    >
      {/* each chapter is an open book: an illustrated plate on the left, the text on the right */}
      <div
        className={`rounded-lg transition duration-500 ${
          here ? "scale-[1.02] drop-shadow-[0_0_22px_rgb(255_201_74/0.55)]" : ""
        }`}
      >
      <OpenBook
        compact
        split="lg"
        left={
          <figure className="flex h-full flex-col items-center gap-2">
            <div className="w-full rounded-sm border border-[#8a6f45]/60 p-1 shadow-[inset_0_0_12px_rgb(60_30_10/0.35)]">
              <WikiImage src={preview?.image} alt="" className="h-44 w-full rounded-[2px] sepia-[.2] md:h-52" />
            </div>
            <figcaption className="font-display text-[10px] uppercase tracking-[0.3em] text-ink/60">
              Chapter {toRoman(index + 1)}
            </figcaption>
          </figure>
        }
        right={
          <div className="flex h-full flex-col gap-2">
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-blood/80">{chapter.era}</p>
            <h2 className="font-display text-xl font-bold leading-tight text-blood">{title}</h2>
            <p className="font-display text-sm italic text-ink/80">{chapter.hook}</p>
            {preview?.summary && (
              <p className="line-clamp-4 text-sm leading-relaxed text-ink/75 first-letter:font-display first-letter:text-2xl first-letter:font-bold first-letter:text-blood">
                {preview.summary}
              </p>
            )}
            <Link
              to={itemPath(WIKI_SECTION, title)}
              className="mt-auto self-start pt-1 font-display text-sm font-semibold text-blood underline-offset-4 hover:underline"
            >
              Read more →
            </Link>
          </div>
        }
      />
      </div>
    </li>
  );
}
