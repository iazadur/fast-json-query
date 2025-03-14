import { renderHook } from '@testing-library/react';
import { useJsonQuery } from '@/hooks/useJsonQuery';
import { Query } from '@/types';

interface TestItem {
  id: number;
  name: string;
  age: number;
  status: string;
  tags?: string[];
  email?: string;
}

describe('useJsonQuery', () => {
  const mockData: TestItem[] = [
    { id: 1, name: 'John', age: 30, status: 'active' },
    { id: 2, name: 'Jane', age: 25, status: 'pending' },
    { id: 3, name: 'Bob', age: 35, status: 'active' },
  ];

  it('should return empty array for invalid data', () => {
    const { result } = renderHook(() => useJsonQuery<TestItem>(null as any, {}));
    expect(result.current).toEqual([]);
  });

  it('should return empty array for invalid query', () => {
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, null as any));
    expect(result.current).toEqual([]);
  });

  it('should filter by simple equality', () => {
    const query: Query = { status: 'active' };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(2);
    expect(result.current.every((item: TestItem) => item.status === 'active')).toBe(true);
  });

  it('should filter by comparison operators', () => {
    const query: Query = { age: { $gt: 30 } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].age).toBe(35);
  });

  it('should filter by regex', () => {
    const query: Query = { name: { $regex: /^J/ } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(2);
    expect(result.current.every((item: TestItem) => item.name.startsWith('J'))).toBe(true);
  });

  it('should filter by array operators', () => {
    const data: TestItem[] = [
      { id: 1, name: 'John', age: 30, status: 'active', tags: ['react', 'typescript'] },
      { id: 2, name: 'Jane', age: 25, status: 'pending', tags: ['javascript'] },
      { id: 3, name: 'Bob', age: 35, status: 'active', tags: ['react', 'node'] },
    ];
    const query: Query = { tags: { $contains: 'react' } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(data, query));
    expect(result.current).toHaveLength(2);
    expect(result.current.every((item: TestItem) => item.tags?.includes('react'))).toBe(true);
  });

  it('should handle logical operators', () => {
    const query: Query = {
      $or: [
        { age: { $gt: 30 } },
        { status: 'pending' }
      ]
    };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(2);
    expect(result.current.some((item: TestItem) => item.age > 30)).toBe(true);
    expect(result.current.some((item: TestItem) => item.status === 'pending')).toBe(true);
  });

  it('should handle case sensitivity option', () => {
    const query: Query = { name: { $regex: /john/ } };
    const { result: caseSensitive } = renderHook(() =>
      useJsonQuery<TestItem>(mockData, query, { caseSensitive: true })
    );
    const { result: caseInsensitive } = renderHook(() =>
      useJsonQuery<TestItem>(mockData, query, { caseSensitive: false })
    );
    expect(caseSensitive.current).toHaveLength(0);
    expect(caseInsensitive.current).toHaveLength(1);
  });

  it('should handle type checking', () => {
    const query: Query = { age: { $type: 'number' } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(3);
    expect(result.current.every((item: TestItem) => typeof item.age === 'number')).toBe(true);
  });

  it('should handle existence checking', () => {
    const query: Query = { email: { $exists: false } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(3);
    expect(result.current.every((item: TestItem) => !('email' in item))).toBe(true);
  });

  it('should handle $in operator', () => {
    const query: Query = { status: { $in: ['active', 'pending'] } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(3);
  });

  it('should handle $nin operator', () => {
    const query: Query = { status: { $nin: ['active'] } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].status).toBe('pending');
  });

  it('should handle $ne operator', () => {
    const query: Query = { status: { $ne: 'active' } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].status).toBe('pending');
  });

  it('should handle $and operator', () => {
    const query: Query = {
      $and: [
        { age: { $gt: 25 } },
        { status: 'active' }
      ]
    };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(2);
    expect(result.current.every((item: TestItem) => item.age > 25 && item.status === 'active')).toBe(true);
  });

  it('should handle $not operator', () => {
    const query: Query = {
      $not: { status: 'active' }
    };
    const { result } = renderHook(() => useJsonQuery<TestItem>(mockData, query));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].status).toBe('pending');
  });

  it('should handle $size operator', () => {
    const data: TestItem[] = [
      { id: 1, name: 'John', age: 30, status: 'active', tags: ['react', 'typescript'] },
      { id: 2, name: 'Jane', age: 25, status: 'pending', tags: ['javascript'] },
    ];
    const query: Query = { tags: { $size: 2 } };
    const { result } = renderHook(() => useJsonQuery<TestItem>(data, query));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].tags).toHaveLength(2);
  });
});
