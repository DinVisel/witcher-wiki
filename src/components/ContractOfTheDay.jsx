import { getCategoryPage, getPreviews } from "../services/api";
import { itemPath, SECTIONS } from "../config/sections";
import { useFetch } from "../hooks/useFetch";
import ItemCard from "./ItemCard";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

/** Day number since the epoch, so everyone gets the same monster all day. */
function todaySeed() {
  return Math.floor(Date.now() / 86_400_000);
}

/** Pick today's monster from the first Bestiary page and load its preview. */
async function fetchContract(signal) {
  const { titles } = await getCategoryPage(SECTIONS.monsters.category, null, { signal });
  if (!titles.length) return null;
  const [monster] = await getPreviews([titles[todaySeed() % titles.length]], { signal });
  return monster ?? null;
}

/** "Contract of the day" notice-board card on the home page. */
export default function ContractOfTheDay() {
  const { data, loading, error, retry } = useFetch(fetchContract, []);

  return (
    <section
      aria-labelledby="contract-heading"
      className="relative mx-auto max-w-md -rotate-1 border border-[#bfa878] bg-parchment p-6 pt-10 text-center text-ink shadow-[inset_0_0_50px_rgb(120_80_30/0.35),8px_12px_24px_rgb(0_0_0/0.6)]"
    >
      {/* nail pinning the notice to the board */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-3 size-4 -translate-x-1/2 rounded-full bg-radial-[at_35%_35%] from-steel to-ink shadow-[0_2px_3px_rgb(0_0_0/0.6)]"
      />
      <h2 id="contract-heading" className="font-display text-2xl font-black tracking-wide text-blood">
        Contract of the day
      </h2>
      <p className="mt-1 text-sm italic text-ink/70">Posted on the notice board this morning. Reward negotiable.</p>
      {/* wax seal */}
      <span
        aria-hidden="true"
        className="absolute -bottom-4 -right-3 grid size-14 rotate-12 place-items-center rounded-full bg-radial-[at_35%_30%] from-[#c0262c] to-[#5a0a0e] font-display text-xl font-black text-[#3a0507] shadow-[0_3px_6px_rgb(0_0_0/0.5)]"
      >
        W
      </span>
      <div className="mt-6 text-left">
        {loading && <Loader label="Reading the notice board…" />}
        {error && <ErrorMessage message={error.message} onRetry={retry} />}
        {data && (
          <div className="mx-auto max-w-xs">
            <ItemCard {...data} to={itemPath(SECTIONS.monsters, data.title)} variant="parchment" />
          </div>
        )}
      </div>
    </section>
  );
}
