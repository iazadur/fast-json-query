import { useMemo } from 'react';
import queryJSON from '../index';
import type { QueryCondition } from '../types';

export function useJsonQuery<T>(data: T[], query: QueryCondition) {
  const results = useMemo(() => {
    try {
      return queryJSON(data, query);
    } catch (error) {
      console.error('Error in useJsonQuery:', error);
      return [];
    }
  }, [data, query]);

  return results;
} 