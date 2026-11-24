/** Infobox facts (label → value) from a wiki page, shown as a definition list. */
export default function InfoTable({ facts, className = "" }) {
  if (!facts.length) return null;
  return (
    <dl className={`divide-y divide-steel/15 overflow-hidden rounded-lg border border-steel/20 bg-ash ${className}`}>
      {facts.map((f) => (
        <div key={f.label} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm">
          <dt className="font-display text-xs uppercase tracking-wider text-gold">{f.label}</dt>
          <dd className="col-span-2 text-silver">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
