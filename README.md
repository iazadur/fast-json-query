# fast-json-query

A lightweight and efficient JSON querying utility for filtering and searching data. Inspired by MongoDB's query syntax but designed for in-memory JSON data in Node.js, React, and Next.js applications.

[![npm version](https://badge.fury.io/js/fast-json-query.svg)](https://badge.fury.io/js/fast-json-query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/fast-json-query)](https://bundlephobia.com/package/fast-json-query)

## Features

- 🚀 Ultra-lightweight (core: 2KB, hooks: 1KB)
- 💪 TypeScript support
- 🔍 MongoDB-like query syntax
- 📦 Zero dependencies
- 🌳 Nested object support
- ⚡ Rich query operators
- 🎯 React hooks included
- ⚛️ Next.js compatible
- 🔄 Tree-shakeable
- 🎨 ESM & CommonJS support

## Installation

```bash
npm install fast-json-query
# or
yarn add fast-json-query
# or
pnpm add fast-json-query
```

## Usage

### Basic Usage

```typescript
import queryJSON from 'fast-json-query';

const data = [
  { id: 1, name: 'Alice', age: 25, city: 'New York' },
  { id: 2, name: 'Bob', age: 30, city: 'London' },
  { id: 3, name: 'Charlie', age: 35, city: 'New York' },
];

// Simple equality
const newYorkers = queryJSON(data, { city: 'New York' });
// [{ id: 1, ... }, { id: 3, ... }]

// Comparison operators
const over30 = queryJSON(data, { age: { $gt: 30 } });
// [{ id: 3, ... }]

// Multiple conditions
const result = queryJSON(data, {
  city: 'New York',
  age: { $lt: 30 }
});
// [{ id: 1, ... }]
```

### React Hooks

#### Basic Query Hook

```tsx
import { useJsonQuery } from 'fast-json-query/hooks';

function UserList() {
  const users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'admin' },
  ];

  const admins = useJsonQuery(users, { role: 'admin' });

  return (
    <ul>
      {admins.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### Debounced Query Hook (for Search)

```tsx
import { useDebounceQuery } from 'fast-json-query/hooks';

function SearchableUserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const users = [
    { id: 1, name: 'Alice', skills: ['React', 'TypeScript'] },
    { id: 2, name: 'Bob', skills: ['Python', 'Django'] },
    { id: 3, name: 'Charlie', skills: ['React', 'Node.js'] },
  ];

  const { results, isDebouncing } = useDebounceQuery(
    users,
    {
      $or: [
        { name: { $regex: new RegExp(searchTerm, 'i') } },
        { skills: { $contains: searchTerm } }
      ]
    },
    300 // debounce time in ms
  );

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      {isDebouncing && <span>Searching...</span>}
      <ul>
        {results.map(user => (
          <li key={user.id}>
            {user.name} - {user.skills.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Next.js Example (App Router)

```tsx
// app/users/page.tsx
'use client';

import { useDebounceQuery } from 'fast-json-query/hooks';
import { useState } from 'react';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const users = [
    { id: 1, name: 'Alice', skills: ['React', 'TypeScript'] },
    { id: 2, name: 'Bob', skills: ['Python', 'Django'] },
    { id: 3, name: 'Charlie', skills: ['React', 'Node.js'] },
  ];

  const { results, isDebouncing } = useDebounceQuery(users, {
    $or: [
      { name: { $regex: new RegExp(searchTerm, 'i') } },
      { skills: { $contains: searchTerm } }
    ]
  });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      {isDebouncing && <span>Searching...</span>}
      <ul>
        {results.map(user => (
          <li key={user.id}>
            {user.name} - {user.skills.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equals | `{ age: { $eq: 25 } }` |
| `$ne` | Not equals | `{ age: { $ne: 25 } }` |
| `$gt` | Greater than | `{ age: { $gt: 25 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 25 } }` |
| `$lt` | Less than | `{ age: { $lt: 25 } }` |
| `$lte` | Less than or equal | `{ age: { $lte: 25 } }` |
| `$in` | In array | `{ city: { $in: ['NY', 'LA'] } }` |
| `$nin` | Not in array | `{ city: { $nin: ['NY', 'LA'] } }` |
| `$regex` | Regular expression | `{ name: { $regex: /^A/ } }` |
| `$exists` | Check if field exists | `{ email: { $exists: true } }` |
| `$type` | Check value type | `{ age: { $type: 'number' } }` |
| `$size` | Check array size | `{ tags: { $size: 2 } }` |
| `$contains` | Check if array contains value | `{ tags: { $contains: 'react' } }` |

## Advanced Usage

### Nested Objects

```typescript
const users = [
  { 
    id: 1,
    profile: {
      name: 'John',
      address: {
        city: 'New York'
      }
    }
  }
];

const result = queryJSON(users, {
  'profile.address.city': 'New York'
});
```

### Multiple Conditions

```typescript
const result = queryJSON(data, {
  age: { $gt: 25, $lt: 35 },
  city: { $in: ['New York', 'London'] },
  active: true
});
```

### Logical Operators

```typescript
const result = queryJSON(data, {
  $or: [
    { city: 'New York' },
    { age: { $gt: 30 } }
  ],
  $and: [
    { active: true },
    { role: 'admin' }
  ]
});
```

## TypeScript Support

The package includes TypeScript definitions and supports generic types:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const users: User[] = [...];
const result = queryJSON<User>(users, { age: { $gt: 25 } });
```

## Performance

The package is designed to be ultra-lightweight and fast:
- Zero dependencies
- Tree-shakeable exports
- Memoized React hooks
- Debounced search support
- Core bundle: 2KB minified
- Hooks bundle: 1KB minified
- Uses native JavaScript array methods

## Browser Support

- Chrome >= 61
- Firefox >= 60
- Safari >= 10.1
- Edge >= 16
- Opera >= 48

## Framework Compatibility

### React
- React 16.8+ (for hooks)
- React 16+ (for core functionality)
- React Native supported

### Next.js
- Next.js 12+
- Both Pages and App Router
- Server Components (core functionality)
- Client Components (hooks)

### Node.js
- Node.js 14+
- CommonJS and ESM support
- TypeScript support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Md Azadur](https://github.com/iazadur)
