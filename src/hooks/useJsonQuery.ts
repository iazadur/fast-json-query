import { useMemo } from "react";
import queryJSON from "../index";
import { Query, QueryOptions } from "../types";

export function useJsonQuery<T>(
  data: T[],
  query: Query,
  options: QueryOptions = {}
): T[] {
  return useMemo(() => {
    try {
      if (!Array.isArray(data) || !query || typeof query !== "object") {
        return [];
      }
      return queryJSON<T>(data, query, {
        caseSensitive: options.caseSensitive,
      });
    } catch (error) {
      console.error("Error in useJsonQuery:", error);
      return [];
    }
  }, [data, query, options.caseSensitive]);
}
