# @disckit/cache

LRU and TTL in-memory cache. O(1) get/set via doubly-linked-list + Map. Zero external dependencies.

```sh
npm install @disckit/cache
```

[![npm](https://img.shields.io/npm/v/@disckit/cache?style=flat-square&color=ff468a)](https://www.npmjs.com/package/@disckit/cache)

## Overview

Two classes are available:

- **`LRUCache`** — evicts the least-recently-used entry when at capacity. No expiration.
- **`TTLCache`** — LRU with per-entry expiration. Expired entries are lazily evicted on access.

A `createCache()` factory picks the right class for you.

## Quick start

```js
const { LRUCache, TTLCache, createCache } = require("@disckit/cache");

// LRU only — evicts oldest when full
const lru = new LRUCache(100);
lru.set("user:123", { name: "Alice" });
lru.get("user:123"); // { name: "Alice" }

// LRU + TTL — entries expire after 5 minutes by default
const cache = new TTLCache(500, 5 * 60_000);
cache.set("guild:456", data);
cache.set("temp", value, 10_000); // 10 s override for this entry

// Factory — returns LRUCache or TTLCache depending on ttlMs
const c = createCache(200);          // pure LRU
const t = createCache(200, 60_000);  // LRU + TTL 1 min
```

## LRUCache

### Constructor

```js
new LRUCache(maxSize)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `maxSize` | `number` | Maximum number of entries. Must be a positive integer. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get(key)` | `V \| undefined` | Returns the value and promotes the entry to MRU position. |
| `peek(key)` | `V \| undefined` | Returns the value **without** updating recency. |
| `has(key)` | `boolean` | Returns true if the key exists. |
| `set(key, value)` | `void` | Stores a value. Evicts LRU entry if at capacity. |
| `delete(key)` | `boolean` | Removes a key. Returns true if it existed. |
| `clear()` | `void` | Removes all entries. |
| `keys()` | `K[]` | Returns all keys from LRU → MRU. |
| `entries()` | `IterableIterator<[K, V]>` | Iterates `[key, value]` pairs from LRU → MRU. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `size` | `number` | Current number of entries. |
| `maxSize` | `number` | Capacity passed to the constructor. |

## TTLCache

### Constructor

```js
new TTLCache(maxSize, ttlMs?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxSize` | `number` | — | Maximum number of live entries. |
| `ttlMs` | `number` | `0` | Default TTL in milliseconds. `0` means no expiration. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get(key)` | `V \| undefined` | Returns value or `undefined` if missing/expired. |
| `has(key)` | `boolean` | Returns true if the key exists and is not expired. |
| `set(key, value, ttlMs?)` | `void` | Stores a value. `ttlMs` overrides the default TTL for this entry. |
| `getOrSet(key, fn, ttlMs?)` | `V \| Promise<V>` | Returns cached value or calls `fn()` to load and store it. Supports async loaders. |
| `delete(key)` | `boolean` | Removes a key. Returns true if it existed. |
| `clear()` | `void` | Removes all entries. |
| `purgeExpired()` | `number` | Proactively removes all expired entries. Returns the count evicted. |
| `entries()` | `Array<[K, V]>` | Returns all live `[key, value]` pairs. Expired entries are skipped and evicted. |
| `keys()` | `K[]` | Returns all live keys. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `size` | `number` | Current number of entries (includes not-yet-evicted expired entries). |
| `maxSize` | `number` | Capacity passed to the constructor. |

## createCache

```js
createCache(maxSize?, ttlMs?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxSize` | `number` | `500` | Maximum number of entries. |
| `ttlMs` | `number` | `0` | If `> 0`, returns a `TTLCache`. Otherwise returns an `LRUCache`. |

## Examples

### Cache Discord API responses

```js
const { TTLCache } = require("@disckit/cache");

const guildCache = new TTLCache(1000, 10 * 60_000); // 10 min TTL

async function getGuild(id) {
  return guildCache.getOrSet(`guild:${id}`, () => fetchGuildFromAPI(id), 5 * 60_000);
}
```

### Periodic cleanup

```js
// If you store millions of short-lived keys, purge proactively
setInterval(() => {
  const evicted = cache.purgeExpired();
  if (evicted > 0) console.log(`Purged ${evicted} expired entries`);
}, 60_000);
```

### Per-entry TTL override

```js
const cache = new TTLCache(500, 60_000); // default: 1 min

cache.set("stable-config", config, 10 * 60_000); // 10 min
cache.set("volatile-data", data,   5_000);        // 5 s
cache.set("persistent",    value,  0);             // never expires
```
