import { renderHook, act } from '@testing-library/react';
import { useDebounceQuery } from '@/hooks/useDebounceQuery';
import { Query } from '@/types';

interface TestItem {
  id: number;
  name: string;
  age: number;
  status: string;
  tags?: string[];
}

jest.useFakeTimers();

describe('useDebounceQuery', () => {
  const mockData: TestItem[] = [
    { id: 1, name: 'John', age: 30, status: 'active' },
    { id: 2, name: 'Jane', age: 25, status: 'pending' },
    { id: 3, name: 'Bob', age: 35, status: 'active' },
  ];

  it('should return empty array and false debouncing for invalid data', () => {
    const { result } = renderHook(() => useDebounceQuery<TestItem>(null as any, {}));
    expect(result.current.results).toEqual([]);
    expect(result.current.isDebouncing).toBe(false);
  });

  it('should return empty array and false debouncing for invalid query', () => {
    const { result } = renderHook(() => useDebounceQuery<TestItem>(mockData, null as any));
    expect(result.current.results).toEqual([]);
    expect(result.current.isDebouncing).toBe(false);
  });

  it('should debounce query updates', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query),
      {
        initialProps: { query: { status: 'active' } },
      }
    );

    // Initial state
    expect(result.current.results).toHaveLength(2);
    expect(result.current.isDebouncing).toBe(false);

    // Update query
    rerender({ query: { status: 'pending' } });
    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(2); // Still showing old results

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
  });

  it('should respect custom delay', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query, { delay: 500 }),
      {
        initialProps: { query: { status: 'active' } },
      }
    );

    rerender({ query: { status: 'pending' } });
    expect(result.current.isDebouncing).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(true); // Still debouncing

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
  });

  it('should handle multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query),
      {
        initialProps: { query: { status: 'active' } },
      }
    );

    // Multiple rapid updates
    rerender({ query: { status: 'pending' } });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ query: { status: 'active' } });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ query: { status: 'pending' } });

    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(2); // Still showing old results

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
  });

  it('should handle complex queries with debouncing', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query),
      {
        initialProps: {
          query: {
            $or: [
              { age: { $gt: 30 } },
              { status: 'pending' }
            ]
          }
        },
      }
    );

    expect(result.current.results).toHaveLength(2);

    rerender({
      query: {
        $and: [
          { age: { $gt: 30 } },
          { status: 'active' }
        ]
      }
    });

    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(2); // Still showing old results

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
  });

  it('should handle case sensitivity option with debouncing', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query, { caseSensitive: true }),
      {
        initialProps: { query: { name: { $regex: /john/ } } },
      }
    );

    expect(result.current.results).toHaveLength(0);

    rerender({ query: { name: { $regex: /John/ } } });
    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
  });

  it('should handle array operators with debouncing', () => {
    const data: TestItem[] = [
      { id: 1, name: 'John', age: 30, status: 'active', tags: ['react', 'typescript'] },
      { id: 2, name: 'Jane', age: 25, status: 'pending', tags: ['javascript'] },
      { id: 3, name: 'Bob', age: 35, status: 'active', tags: ['react', 'node'] },
    ];

    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(data, query),
      {
        initialProps: { query: { tags: { $contains: 'react' } } },
      }
    );

    expect(result.current.results).toHaveLength(2);

    rerender({ query: { tags: { $contains: 'javascript' } } });
    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(2); // Still showing old results

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(1);
  });

  it('should handle type checking with debouncing', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query),
      {
        initialProps: { query: { age: { $type: 'number' } } },
      }
    );

    expect(result.current.results).toHaveLength(3);

    rerender({ query: { age: { $type: 'string' } } });
    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(3); // Still showing old results

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(0);
  });

  it('should handle existence checking with debouncing', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: Query }) => useDebounceQuery<TestItem>(mockData, query),
      {
        initialProps: { query: { email: { $exists: false } } },
      }
    );

    expect(result.current.results).toHaveLength(3);

    rerender({ query: { email: { $exists: true } } });
    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.results).toHaveLength(3); // Still showing old results

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.results).toHaveLength(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
