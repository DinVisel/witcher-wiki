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
    <section aria-labelledby="contract-heading" className="rounded-xl border border-[#bfa878]/40 bg-ash p-6">
      <h2 id="contract-heading" className="font-display text-2xl font-bold text-parchment">
        Contract of the day
      </h2>
      <p className="mt-1 text-sm text-steel">Posted on the notice board this morning. Reward negotiable.</p>
      <div className="mt-6">
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
