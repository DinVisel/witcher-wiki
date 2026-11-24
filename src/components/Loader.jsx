import Medallion from "./Medallion";

/** Swinging wolf medallion with a label; shown while data loads. */
export default function Loader({ label = "The medallion hums…" }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-16 text-steel">
      <Medallion className="size-16 origin-top motion-safe:animate-medallion" />
      <p className="font-display text-sm tracking-widest">{label}</p>
    </div>
  );
}
