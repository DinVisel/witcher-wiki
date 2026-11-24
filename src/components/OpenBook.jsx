/** Breakpoint at which the two pages sit side by side (full class names so Tailwind finds them). */
const SPLIT = {
  md: {
    grid: "md:grid-cols-2",
    fold: "md:block",
    left: "md:shadow-[inset_-34px_0_40px_-24px_rgb(60_30_10/0.55)]",
    right: "md:shadow-[inset_34px_0_40px_-24px_rgb(60_30_10/0.55)]",
  },
  lg: {
    grid: "lg:grid-cols-2",
    fold: "lg:block",
    left: "lg:shadow-[inset_-34px_0_40px_-24px_rgb(60_30_10/0.55)]",
    right: "lg:shadow-[inset_34px_0_40px_-24px_rgb(60_30_10/0.55)]",
  },
};

/** One parchment page; `side` decides which edge gets the gutter shadow. */
function Page({ side, compact, shadow, children }) {
  return (
    <div
      className={`relative bg-linear-to-r text-ink ${compact ? "p-4 sm:p-5" : "p-7 sm:p-10"} ${
        side === "left" ? "from-[#d9c8a3] via-parchment to-[#e4d4b0]" : "from-[#e4d4b0] via-parchment to-[#d9c8a3]"
      } ${shadow}`}
    >
      {children}
    </div>
  );
}

/**
 * An open book: a red leather cover with a gold edge and two parchment pages.
 * Pages stack on small screens and sit side by side from the `split`
 * breakpoint ("md" or "lg"). `compact` uses smaller margins (storyline cards).
 */
export default function OpenBook({ left, right, compact = false, split = "md", className = "" }) {
  const s = SPLIT[split] ?? SPLIT.md;
  return (
    <div
      className={`relative mx-auto max-w-5xl rounded-lg bg-linear-to-br from-[#5e1412] via-leather to-[#2a0906] shadow-[0_30px_60px_rgb(0_0_0/0.75)] ring-1 ring-gold/50 ${compact ? "p-1.5 sm:p-2" : "p-2 sm:p-3"} ${className}`}
    >
      <div className={`relative grid overflow-hidden rounded-sm ${s.grid}`}>
        <Page side="left" compact={compact} shadow={s.left}>
          {left}
        </Page>
        <Page side="right" compact={compact} shadow={s.right}>
          {right}
        </Page>
        {/* centre fold */}
        <span aria-hidden="true" className={`absolute inset-y-0 left-1/2 hidden w-px bg-[#8a6f45]/50 ${s.fold}`} />
      </div>
      {/* stacked page edges under the book */}
      <span
        aria-hidden="true"
        className="absolute inset-x-5 -bottom-1.5 h-2 rounded-b-sm bg-[repeating-linear-gradient(0deg,#e2d2ae_0_1px,#b39a6c_1px_2px)]"
      />
    </div>
  );
}
