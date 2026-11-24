import { useEffect } from "react";

/** Sets the browser tab title to "<title> · Witcher Wiki". */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Witcher Wiki` : "Witcher Wiki";
  }, [title]);
}
