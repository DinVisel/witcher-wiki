import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Medallion from "../components/Medallion";
import Button from "../components/Button";

/** Custom 404 for unknown routes. */
export default function NotFoundPage() {
  useDocumentTitle("Lost");
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <Medallion className="size-24 origin-top motion-safe:animate-medallion" />
      <p className="mt-6 font-display text-sm tracking-[0.4em] text-blood">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-silver">You’ve strayed from the Path</h1>
      <p className="mt-4 max-w-md text-steel">
        Even witchers get lost in the mist sometimes. This road leads nowhere — turn back before the drowners notice.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/home">Return to the Continent</Button>
        <Button to="/search" variant="ghost">
          Search the wiki
        </Button>
      </div>
    </div>
  );
}
