import { Link } from "react-router-dom";
import WikiImage from "./WikiImage";

/** Visual themes per section: dark steel, bestiary parchment, glowing rune panel. */
const VARIANTS = {
  steel: {
    card: "bg-ash border-steel/20 hover:border-steel/60 hover:shadow-steel/20",
    title: "text-silver",
    summary: "text-steel",
    image: "",
  },
  parchment: {
    card: "bg-parchment border-[#bfa878] shadow-[inset_0_0_40px_rgba(120,80,30,0.35)] hover:shadow-blood/40",
    title: "text-blood",
    summary: "text-ink/75",
    image: "sepia-[.35]",
  },
  rune: {
    card: "bg-ink border-gold/30 hover:border-gold/70 hover:shadow-gold/30",
    title: "text-gold",
    summary: "text-steel",
    image: "",
  },
};

/** A clickable preview card: image, title and a short summary. */
export default function ItemCard({ title, image, summary, to, variant = "steel", className = "" }) {
  const v = VARIANTS[variant] ?? VARIANTS.steel;
  return (
    <Link
      to={to}
      className={`group flex h-full flex-col overflow-hidden rounded-lg border transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${v.card} ${className}`}
    >
      <WikiImage
        src={image}
        alt=""
        className={`aspect-[4/3] w-full sm:aspect-[4/5] transition duration-500 group-hover:scale-[1.03] ${v.image}`}
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className={`font-display text-lg font-semibold leading-tight tracking-wide ${v.title}`}>{title}</h2>
        {summary && <p className={`line-clamp-3 text-sm ${v.summary}`}>{summary}</p>}
      </div>
    </Link>
  );
}
