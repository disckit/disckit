<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/cache"><img src="https://img.shields.io/npm/v/@disckit/cache.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/cache"><img src="https://img.shields.io/npm/dt/@disckit/cache.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/cache</h3>
  <p>LRU and TTL cache implementations. Doubly-linked-list + Map for O(1) get/set. Zero dependencies.</p>
</div>

---

## Features

- **`LRUCache`** — doubly-linked-list + Map, O(1) get/set/delete, configurable `maxSize`
- **`TTLCache`** — time-to-live eviction, optional per-entry TTL override, lazy or scheduled sweep
- Both caches share the same API surface — swap them without changing call sites
- `has()`, `delete()`, `clear()`, `entries()`, `keys()`, `values()` included on both
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/cache
yarn add @disckit/cache
pnpm add @disckit/cache
```

## Usage

### LRUCache

```js
const { LRUCache } = require('@disckit/cache');

const cache = new LRUCache(500); // max 500 entries

cache.set('user:123', { name: 'Alice' });
cache.get('user:123'); // → { name: 'Alice' }
cache.has('user:123'); // → true
cache.size;            // → 1

// Least-recently-used entry is evicted automatically when maxSize is reached
```

### TTLCache

```js
const { TTLCache } = require('@disckit/cache');

const cache = new TTLCache({ ttl: 60_000 }); // 1 minute default TTL

cache.set('token:abc', 'secret');
cache.set('session:xyz', data, { ttl: 5 * 60_000 }); // 5 min override

setTimeout(() => {
  cache.get('token:abc'); // → undefined (expired)
}, 61_000);

// Scheduled sweep — removes expired entries every 30 seconds
const cache2 = new TTLCache({ ttl: 30_000, sweepEveryMs: 30_000 });
```

## API Reference

### `LRUCache(maxSize)`

| Method | Description |
|--------|-------------|
| `get(key)` | Returns value or `undefined`. Marks entry as recently used. |
| `set(key, value)` | Inserts/updates. Evicts LRU entry if at capacity. |
| `has(key)` | Returns `boolean`. Does **not** affect recency. |
| `delete(key)` | Removes entry. Returns `boolean`. |
| `clear()` | Empties the cache. |
| `peek(key)` | Returns value without affecting recency. |
| `entries()` | Iterator of `[key, value]` pairs, MRU → LRU. |

### `TTLCache(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttl` | `number` | required | Default TTL in ms |
| `sweepEveryMs` | `number` | `0` | Interval to remove expired entries. `0` = lazy only |

`set(key, value, options?)` accepts `{ ttl: number }` to override per-entry TTL.

## Links

- [npm](https://www.npmjs.com/package/@disckit/cache)
- [GitHub](https://github.com/disckit/disckit/tree/main/cache)
- [disckit monorepo](https://github.com/disckit/disckit)
