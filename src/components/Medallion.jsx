/** The wolf medallion, drawn as inline SVG. Used by the logo, loader and placeholders. */
export default function Medallion({ className = "size-10", title }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <circle cx="32" cy="32" r="29" className="fill-ash stroke-gold" strokeWidth="3" />
      <circle cx="32" cy="32" r="24" className="fill-none stroke-gold/40" strokeWidth="1" />
      <path d="M16 18l8 8 8-4 8 4 8-8-3 16-5 8-8 6-8-6-5-8z" className="fill-steel" />
      <path d="M28 44l4 3 4-3-4-2z" className="fill-ink" />
      <circle cx="26" cy="32" r="2" className="fill-blood" />
      <circle cx="38" cy="32" r="2" className="fill-blood" />
    </svg>
  );
}
