import { createContext, useCallback, useMemo, useState } from "react";

/** Witcher Senses on/off. While on, hidden clues glow red across the wiki. */
// eslint-disable-next-line react-refresh/only-export-components
export const SensesContext = createContext({ on: false, toggle: () => {} });

export function SensesProvider({ children }) {
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => setOn((v) => !v), []);
  const value = useMemo(() => ({ on, toggle }), [on, toggle]);
  return <SensesContext.Provider value={value}>{children}</SensesContext.Provider>;
}
