import { useCallback, useEffect, useState } from "react";

/**
 * Runs an async fetcher(signal) and tracks its state.
 * Returns { data, loading, error, retry }. The request is aborted on unmount or
 * when deps change, so a stale response never overwrites a newer one.
 * `loading` is derived: the stored result belongs to an older request key.
 */
export function useFetch(fetcher, deps) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const key = JSON.stringify([...deps, attempt]);

  useEffect(() => {
    const controller = new AbortController();
    fetcher(controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setResult({ key, data: null, error });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loading = result.key !== key;
  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    retry,
  };
}
