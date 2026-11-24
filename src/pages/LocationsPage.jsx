import { LOCATION_TYPES, SECTIONS } from "../config/sections";
import { useFilterParam } from "../hooks/useFilterParam";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ListingView from "../components/ListingView";
import FilterChips from "../components/FilterChips";

/** Places of the Continent, filterable by kind of place (?type=). */
export default function LocationsPage() {
  useDocumentTitle("Locations");
  const { option, value, setValue } = useFilterParam("type", LOCATION_TYPES);

  return (
    <ListingView
      section={SECTIONS.locations}
      category={option.category}
      title={value ? `Locations · ${option.label}` : "Locations"}
      filters={<FilterChips options={LOCATION_TYPES} value={value} onChange={setValue} label="Kind of place" />}
    />
  );
}
