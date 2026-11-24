/** Page title + subtitle. `children` render on the right (or below on mobile). */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-steel/20 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide text-silver sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-steel">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
