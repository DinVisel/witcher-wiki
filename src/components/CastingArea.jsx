import { useSignCasting } from "../hooks/useSignCasting";
import SignEffect from "./effects/SignEffect";

/** A large practice area on a sign's detail page with a big Cast button. */
export default function CastingArea({ sign }) {
  const { casting, cast, finish } = useSignCasting();
  const active = casting?.name === sign.name ? casting : null;

  return (
    <section aria-label={`Practise ${sign.name}`} className="mb-8">
      <div
        className={`relative grid h-72 place-items-center overflow-hidden rounded-lg border bg-ink shadow-[0_0_40px] ${sign.border} ${sign.glow} ${active ? sign.castWrapper : ""}`}
      >
        <div className={`text-center transition duration-300 ${active ? sign.castContent : ""}`}>
          <p className={`font-display text-6xl font-black tracking-[0.3em] ${sign.text}`}>{sign.name}</p>
          <p className="mt-2 text-sm text-steel">{sign.hint}</p>
        </div>
        <SignEffect casting={active} onDone={finish} />
      </div>
      <button
        type="button"
        onClick={() => cast(sign.name)}
        aria-label={`Cast ${sign.name}`}
        className={`mt-4 w-full rounded-md border bg-ink py-3 font-display text-lg font-bold tracking-[0.25em] transition hover:bg-silver/5 ${sign.border} ${sign.text}`}
      >
        {active && sign.persistent ? "Dismiss" : `Cast ${sign.name}`}
      </button>
    </section>
  );
}
