import { renderHook } from '@testing-library/react';
import { useJsonQuery } from './useJsonQuery';

const testData = [
  { id: 1, name: 'Alice', age: 25, city: 'New York' },
  { id: 2, name: 'Bob', age: 30, city: 'London' },
  { id: 3, name: 'Charlie', age: 35, city: 'New York' },
];

describe('useJsonQuery', () => {
  it('should filter data based on query', () => {
    const query = { city: 'New York' };
    const { result } = renderHook(() => useJsonQuery(testData, query));
    
    expect(result.current).toHaveLength(2);
    expect(result.current.map(item => item.id)).toEqual([1, 3]);
  });

  it('should handle complex queries', () => {
    const query = {
      $or: [
        { city: 'London' },
        { age: { $gt: 30 } }
      ]
    };
    const { result } = renderHook(() => useJsonQuery(testData, query));
    
    expect(result.current).toHaveLength(2);
    expect(result.current.map(item => item.id)).toEqual([2, 3]);
  });

  it('should handle invalid data gracefully', () => {
    const { result } = renderHook(() => useJsonQuery(null as any, {}));
    expect(result.current).toEqual([]);
  });

  it('should memoize results', () => {
    const query = { city: 'New York' };
    const { result, rerender } = renderHook(() => useJsonQuery(testData, query));
    const firstResult = result.current;
    
    rerender();
    expect(result.current).toBe(firstResult);
  });
}); 