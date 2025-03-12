import { renderHook, act } from '@testing-library/react';
import { useDebounceQuery } from './useDebounceQuery';

const testData = [
  { id: 1, name: 'Alice', age: 25, city: 'New York' },
  { id: 2, name: 'Bob', age: 30, city: 'London' },
  { id: 3, name: 'Charlie', age: 35, city: 'New York' },
];

describe('useDebounceQuery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce query updates', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useDebounceQuery(testData, query, 300),
      { initialProps: { query: { city: 'New York' } } }
    );

    // Initial render
    expect(result.current.results).toHaveLength(2);
    expect(result.current.isDebouncing).toBe(false);

    // Update query
    rerender({ query: { city: 'London' } });
    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(2); // Still showing old results

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].id).toBe(2);
  });

  it('should handle rapid query updates', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useDebounceQuery(testData, query, 300),
      { initialProps: { query: { city: 'New York' } } }
    );

    // Multiple rapid updates
    rerender({ query: { city: 'London' } });
    rerender({ query: { city: 'Paris' } });
    rerender({ query: { city: 'Tokyo' } });

    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(2); // Still showing initial results

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(0); // No results for Tokyo
  });

  it('should handle invalid data gracefully', () => {
    const { result } = renderHook(() =>
      useDebounceQuery(null as any, { city: 'New York' }, 300)
    );

    expect(result.current.results).toEqual([]);
    expect(result.current.isDebouncing).toBe(false);
  });
}); 