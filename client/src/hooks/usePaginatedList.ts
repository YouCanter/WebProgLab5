import { useEffect, useState, useCallback } from "react";
import { ApiError } from "@/api/httpClient";
import type { Paginated } from "@/types/api";

export interface UsePaginatedListResult<T> {
  data: T[];
  meta: Paginated<T>["meta"] | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
}

type Loader<T, Q> = (query: Q, signal: AbortSignal) => Promise<Paginated<T>>;

export const usePaginatedList = <T, Q>(
  loader: Loader<T, Q>,
  query: Q,
): UsePaginatedListResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<Paginated<T>["meta"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    loader(query, controller.signal)
      .then((result) => {
        setData(result.data);
        setMeta(result.meta);
      })
      .catch((err: unknown) => {
        if ((err as Error).name === "AbortError") return;
        if (err instanceof ApiError) setError(err);
        else setError(new ApiError({ code: "UNKNOWN", message: (err as Error).message, status: 0 }));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query), reloadToken]);

  return { data, meta, loading, error, reload };
};
