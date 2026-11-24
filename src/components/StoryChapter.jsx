import { Link } from "react-router-dom";
import { itemPath, WIKI_SECTION } from "../config/sections";
import { useInView } from "../hooks/useInView";
import WikiImage from "./WikiImage";

/** One timeline chapter. Fades in when scrolled into view; alternates sides on md+. */
export default function StoryChapter({ chapter, preview, index }) {
  const [ref, inView] = useInView();
  const right = index % 2 === 1;
  const title = preview?.title ?? chapter.title;

  return (
    <li
      ref={ref}
      className={`relative pl-10 transition-all duration-700 md:w-1/2 md:pl-0 ${
        right ? "md:ml-auto md:pl-12" : "md:pr-12"
      } ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0"}`}
    >
      {/* dot on the timeline */}
      <span
        aria-hidden="true"
        className={`absolute top-6 left-[9px] size-4 rounded-full border-2 border-gold bg-ink shadow-[0_0_12px] shadow-gold/60 ${
          right ? "md:-left-2" : "md:right-[-8px] md:left-auto"
        }`}
      />
      <div className="overflow-hidden rounded-lg border border-steel/20 bg-ash">
        <div className="flex flex-col sm:flex-row">
          <WikiImage src={preview?.image} alt="" className="h-48 w-full shrink-0 sm:h-auto sm:w-40" />
          <div className="flex flex-col gap-2 p-5">
            <p className="font-display text-xs uppercase tracking-[0.25em] text-blood">
              {String(index + 1).padStart(2, "0")} · {chapter.era}
            </p>
            <h2 className="font-display text-2xl font-semibold text-gold">{title}</h2>
            <p className="italic text-silver">{chapter.hook}</p>
            {preview?.summary && <p className="line-clamp-4 text-sm text-steel">{preview.summary}</p>}
            <Link to={itemPath(WIKI_SECTION, title)} className="mt-1 text-sm text-gold hover:underline">
              Read more →
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
