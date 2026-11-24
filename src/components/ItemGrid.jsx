import { itemPath } from "../config/sections";
import ItemCard from "./ItemCard";

/**
 * Responsive grid of item cards for a section. Pass `renderItem` to draw a
 * custom card (the Signs page uses it for cards with a Cast button).
 */
export default function ItemGrid({ items, section, renderItem, emptyText = "No results." }) {
  if (!items.length) {
    return <p className="py-12 text-center font-display text-steel">{emptyText}</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.title} className="motion-safe:animate-fade-in">
          {renderItem ? (
            renderItem(item)
          ) : (
            <ItemCard {...item} to={itemPath(section, item.title)} variant={section.variant} />
          )}
        </li>
      ))}
    </ul>
  );
}
