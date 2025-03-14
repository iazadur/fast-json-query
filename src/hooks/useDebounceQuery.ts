import { useEffect, useMemo, useState } from "react";
import { Query, QueryOptions, UseDebounceQueryResult } from "../types";
import queryJSON from "../index";

export function useDebounceQuery<T>(
  data: T[],
  query: Query,
  options: QueryOptions & { delay?: number } = {}
): UseDebounceQueryResult<T> {
  const [debouncedQuery, setDebouncedQuery] = useState<Query>(query);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const delay = options.delay ?? 300;

  useEffect(() => {
    if (!Array.isArray(data) || !query || typeof query !== "object") {
      setIsDebouncing(false);
      setDebouncedQuery(query);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, query, delay]);

  const results = useMemo(() => {
    try {
      if (
        !Array.isArray(data) ||
        !debouncedQuery ||
        typeof debouncedQuery !== "object"
      ) {
        return [];
      }
      return queryJSON(data, debouncedQuery, {
        caseSensitive: options.caseSensitive,
      });
    } catch (error) {
      console.error("Error in useDebounceQuery:", error);
      return [];
    }
  }, [data, debouncedQuery, options.caseSensitive]);

  // Return initial results without debouncing on first render
  if (debouncedQuery === query) {
    return { results, isDebouncing: false };
  }

  return { results, isDebouncing };
}
