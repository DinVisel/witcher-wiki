import { Link } from "react-router-dom";

/**
 * A leather-bound tome used as a link card: spine with gold bands on the left,
 * embossed gold frame and title on the cover, page edges on the right.
 */
export default function BookCard({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="group relative flex h-full min-h-52 overflow-hidden rounded-r-md rounded-l-sm bg-leather shadow-[6px_8px_18px_rgb(0_0_0/0.6)] transition duration-300 hover:-translate-y-1.5 hover:-rotate-1 hover:shadow-[10px_16px_28px_rgb(0_0_0/0.75)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      {/* spine */}
      <span aria-hidden="true" className="relative w-6 shrink-0 bg-linear-to-r from-[#1c0504] via-[#5a1712] to-[#2b0807]">
        {["top-5", "top-8", "bottom-8", "bottom-5"].map((pos) => (
          <span key={pos} className={`absolute inset-x-0 ${pos} h-0.5 bg-gold/70`} />
        ))}
      </span>

      {/* cover */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-radial-[at_30%_20%] from-[#7e2219] via-leather to-[#2e0b09] px-6 py-8 text-center">
        <span aria-hidden="true" className="absolute inset-2.5 rounded-sm border border-gold/55" />
        <span aria-hidden="true" className="absolute inset-4 rounded-sm border border-gold/20" />
        <svg
          viewBox="0 0 24 24"
          className="size-10 text-gold drop-shadow-[0_1px_0_rgb(0_0_0/0.8)] transition group-hover:text-quen"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={icon} />
        </svg>
        <h3 className="mt-3 font-display text-xl font-bold tracking-wider text-gold [text-shadow:0_1px_0_rgb(0_0_0/0.8),0_0_12px_rgb(201_162_74/0.25)] group-hover:text-quen">
          {title}
        </h3>
        <span aria-hidden="true" className="my-3 h-px w-16 bg-linear-to-r from-transparent via-gold/70 to-transparent" />
        <p className="text-sm text-parchment/75">{description}</p>
      </div>

      {/* fore-edge of the pages */}
      <span
        aria-hidden="true"
        className="my-1.5 w-1.5 shrink-0 rounded-r-sm bg-[repeating-linear-gradient(0deg,#e9dcc0_0_2px,#bfa878_2px_3px)]"
      />
    </Link>
  );
}
