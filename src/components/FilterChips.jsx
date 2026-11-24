/** A row of toggle chips; exactly one option is selected. */
export default function FilterChips({ options, value, onChange, label = "Filter" }) {
  return (
    <div role="group" aria-label={label} className="mb-8 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value || "all"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              active
                ? "border-gold bg-gold text-ink"
                : "border-steel/30 text-steel hover:border-steel hover:text-silver"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
