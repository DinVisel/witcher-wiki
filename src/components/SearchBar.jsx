/** Controlled text input with a search icon and a clear (×) button. */
export default function SearchBar({ value, onChange, placeholder = "Search…", label = "Search", autoFocus }) {
  return (
    <div className="relative w-full md:w-80">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoFocus={autoFocus}
        className="w-full rounded-md border border-steel/30 bg-ash py-2.5 pl-9 pr-9 text-silver placeholder:text-steel/70 focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 text-lg leading-none text-steel hover:text-silver"
        >
          ×
        </button>
      )}
    </div>
  );
}
