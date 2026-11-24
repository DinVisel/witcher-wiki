import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Keeps the selected filter chip in the URL (?<param>=value) so it survives
 * refresh and the back button. Returns { option, value, setValue }.
 */
export function useFilterParam(param, options) {
  const [params, setParams] = useSearchParams();
  const raw = params.get(param) ?? "";
  const option = options.find((o) => o.value === raw) ?? options[0];

  const setValue = useCallback(
    (value) =>
      setParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        if (value) nextParams.set(param, value);
        else nextParams.delete(param);
        return nextParams;
      }),
    [param, setParams],
  );

  return { option, value: option.value, setValue };
}
