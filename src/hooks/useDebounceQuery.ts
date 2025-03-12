import { useState, useEffect, useMemo } from 'react';
import queryJSON from '../index';
import type { QueryCondition } from '../types';

export function useDebounceQuery<T>(
  data: T[],
  query: QueryCondition,
  debounceMs: number = 300
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs]);

  const results = useMemo(() => {
    try {
      return queryJSON(data, debouncedQuery);
    } catch (error) {
      console.error('Error in useDebounceQuery:', error);
      return [];
    }
  }, [data, debouncedQuery]);

  return {
    results,
    isDebouncing: debouncedQuery !== query,
  };
} 