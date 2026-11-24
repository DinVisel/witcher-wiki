import { SECTIONS } from "../config/sections";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ListingView from "../components/ListingView";

/** Places of the Continent. */
export default function LocationsPage() {
  useDocumentTitle("Locations");
  return <ListingView section={SECTIONS.locations} />;
}
