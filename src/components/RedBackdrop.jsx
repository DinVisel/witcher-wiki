/**
 * Deep red background fading from the top, with a faint gold diamond lattice.
 * Used behind the welcome scene and the home page. Position it with `className`.
 */
export default function RedBackdrop({ className = "absolute inset-0" }) {
  return (
    <div aria-hidden="true" className={`-z-10 bg-velvet-dark ${className}`}>
      <div className="absolute inset-0 bg-radial-[at_50%_0%] from-blood/70 via-velvet-dark to-velvet-dark" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgb(201_162_74/0.04)_0_1px,transparent_1px_28px),repeating-linear-gradient(-45deg,rgb(201_162_74/0.04)_0_1px,transparent_1px_28px)]" />
    </div>
  );
}
