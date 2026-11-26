import { LOCATION_TYPES, SECTIONS } from "../config/sections";
import { useFilterParam } from "../hooks/useFilterParam";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ListingView from "../components/ListingView";
import FilterChips from "../components/FilterChips";
import RooftopRoach from "../components/RooftopRoach";

/** Places of the Continent, filterable by kind of place (?type=). */
export default function LocationsPage() {
  useDocumentTitle("Locations");
  const { option, value, setValue } = useFilterParam("type", LOCATION_TYPES);

  return (
    <ListingView
      section={SECTIONS.locations}
      category={option.category}
      title={value ? `Locations · ${option.label}` : "Locations"}
      filters={
        <div className="flex flex-wrap items-end justify-between gap-x-4">
          <FilterChips options={LOCATION_TYPES} value={value} onChange={setValue} label="Kind of place" />
          <div className="mb-8">
            <RooftopRoach />
          </div>
        </div>
      }
    />
  );
}
