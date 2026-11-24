import IgniEffect from "./IgniEffect";
import AardEffect from "./AardEffect";
import QuenEffect from "./QuenEffect";
import YrdenEffect from "./YrdenEffect";
import AxiiEffect from "./AxiiEffect";

const EFFECTS = { Igni: IgniEffect, Aard: AardEffect, Quen: QuenEffect, Yrden: YrdenEffect, Axii: AxiiEffect };

/**
 * Renders the visual effect for `casting` ({ name, id }) over its parent.
 * The parent must be `relative`. A new id remounts the effect (recast).
 */
export default function SignEffect({ casting, onDone }) {
  const Effect = casting && EFFECTS[casting.name];
  if (!Effect) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg" aria-hidden="true">
      <Effect key={casting.id} onDone={() => onDone(casting.id)} />
    </div>
  );
}
