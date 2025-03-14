# Fast JSON Query

[![npm version](https://img.shields.io/npm/v/fast-json-query.svg)](https://www.npmjs.com/package/fast-json-query)
[![Build Status](https://github.com/iazadur/fast-json-query/workflows/Test/badge.svg)](https://github.com/iazadur/fast-json-query/actions)
[![Coverage Status](https://codecov.io/gh/iazadur/fast-json-query/branch/main/graph/badge.svg)](https://codecov.io/gh/iazadur/fast-json-query)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/fast-json-query)](https://bundlephobia.com/package/fast-json-query)
[![Downloads](https://img.shields.io/npm/dm/fast-json-query.svg)](https://www.npmjs.com/package/fast-json-query)
[![License](https://img.shields.io/npm/l/fast-json-query.svg)](https://github.com/iazadur/fast-json-query/blob/main/LICENSE)

> A blazing-fast, MongoDB-like query engine for filtering JSON data in React applications with TypeScript support and built-in debouncing.

## Why Fast JSON Query?

- 🚀 **Ultra-lightweight**: Only 438B minified + gzipped (core), 695B (with hooks)
- ⚡ **High Performance**: Optimized for large datasets with minimal overhead
- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions
- ⚛️ **React Integration**: Seamless hooks for React applications
- 🔄 **Smart Debouncing**: Built-in performance optimization for real-time filtering
- 📦 **Zero Dependencies**: No external dependencies, pure JavaScript
- 🧪 **Production Ready**: 100% test coverage, battle-tested
- 🌳 **Tree-shakeable**: Import only what you need
- 📝 **Well Documented**: Comprehensive documentation and examples

## Installation

```bash
# Using npm
npm install fast-json-query

# Using yarn
yarn add fast-json-query

# Using pnpm
pnpm add fast-json-query
```

## Quick Start

```typescript
import { useJsonQuery } from 'fast-json-query';

function SearchableUserList() {
  const users = [
    { id: 1, name: 'John Doe', age: 30, skills: ['React', 'TypeScript'] },
    { id: 2, name: 'Jane Smith', age: 25, skills: ['Vue', 'JavaScript'] },
  ];

  // Filter users over 25 with React skills
  const results = useJsonQuery(users, {
    $and: [
      { age: { $gt: 25 } },
      { skills: { $contains: 'React' } }
    ]
  });

  return (
      <ul>
        {results.map(user => (
        <li key={user.id}>{user.name} - {user.age}</li>
        ))}
      </ul>
  );
}
```

## Features

### MongoDB-like Query Syntax

```typescript
// Simple equality
const activeUsers = useJsonQuery(users, { status: 'active' });

// Complex conditions
const seniorDevs = useJsonQuery(users, {
  $or: [
    { experience: { $gt: 5 } },
    { level: { $in: ['senior', 'lead'] } }
  ],
  skills: { $contains: 'JavaScript' }
});
```

### Real-time Search with Debouncing

```typescript
const { results, isDebouncing } = useDebounceQuery(
  users,
  { name: { $regex: searchTerm } },
  { delay: 300 }
);
```

## API Reference

### Query Operators

#### Comparison
- `$eq`: Exact match
- `$gt`, `$gte`: Greater than (or equal)
- `$lt`, `$lte`: Less than (or equal)
- `$ne`: Not equal
- `$in`: Value in array
- `$nin`: Value not in array
- `$regex`: Regular expression match
- `$exists`: Property existence check

#### Logical
- `$and`: All conditions true
- `$or`: Any condition true
- `$not`: Negate condition

#### Array
- `$size`: Array length check
- `$contains`: Array includes value

### Hooks

#### useJsonQuery
```typescript
function useJsonQuery<T>(
  data: T[],
  query: Query,
  options?: QueryOptions
): T[];

interface QueryOptions {
  caseSensitive?: boolean;
}
```

#### useDebounceQuery

```typescript
function useDebounceQuery<T>(
  data: T[],
  query: Query,
  options?: DebounceOptions
): DebounceResult<T>;

interface DebounceOptions extends QueryOptions {
  delay?: number;
}

interface DebounceResult<T> {
  results: T[];
  isDebouncing: boolean;
}
```

## Performance

- **Bundle Size**: Core: 438B, Hooks: 695B (minified + gzipped)
- **Memory Usage**: O(1) space complexity for queries
- **Time Complexity**: O(n) for simple queries, optimized for large datasets

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- IE 11 with appropriate polyfills

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT © [Md Azadur Rahman](https://github.com/iazadur)

## Keywords

json-query, mongodb-query, react-hooks, typescript, json-filter, data-query, react-query, json-search, typescript-query, debounce-query, lightweight-query, fast-query, react-json-query, json-query-engine, mongodb-like-query

---

<p align="center">Made with ❤️ by <a href="https://github.com/iazadur">Md Azadur Rahman</a></p>
