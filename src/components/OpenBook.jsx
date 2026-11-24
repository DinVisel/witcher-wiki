/** One parchment page; `side` decides which edge gets the gutter shadow. */
function Page({ side, children }) {
  return (
    <div
      className={`relative bg-linear-to-r p-7 text-ink sm:p-10 ${
        side === "left"
          ? "from-[#d9c8a3] via-parchment to-[#e4d4b0] md:shadow-[inset_-34px_0_40px_-24px_rgb(60_30_10/0.55)]"
          : "from-[#e4d4b0] via-parchment to-[#d9c8a3] md:shadow-[inset_34px_0_40px_-24px_rgb(60_30_10/0.55)]"
      }`}
    >
      {children}
    </div>
  );
}

/**
 * An open book: a red leather cover with a gold edge and two parchment pages.
 * Pages sit side by side from md: and stack on phones.
 */
export default function OpenBook({ left, right, className = "" }) {
  return (
    <div
      className={`relative mx-auto max-w-5xl rounded-lg bg-linear-to-br from-[#5e1412] via-leather to-[#2a0906] p-2 shadow-[0_30px_60px_rgb(0_0_0/0.75)] ring-1 ring-gold/50 sm:p-3 ${className}`}
    >
      <div className="relative grid overflow-hidden rounded-sm md:grid-cols-2">
        <Page side="left">{left}</Page>
        <Page side="right">{right}</Page>
        {/* centre fold */}
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 hidden w-px bg-[#8a6f45]/50 md:block" />
      </div>
      {/* stacked page edges under the book */}
      <span
        aria-hidden="true"
        className="absolute inset-x-5 -bottom-1.5 h-2 rounded-b-sm bg-[repeating-linear-gradient(0deg,#e2d2ae_0_1px,#b39a6c_1px_2px)]"
      />
    </div>
  );
}
