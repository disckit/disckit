<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
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
  <p>LRU and TTL cache with O(1) get/set. Doubly-linked-list + Map implementation.</p>
</div>

---

## Features

- **`LRUCache`** — pure LRU eviction, O(1) get/set/delete via doubly-linked-list + Map
- **`TTLCache`** — LRUCache + per-entry expiration with lazy eviction on access
- **`createCache()`** — factory helper for the most common case
- **`peek()`** — read without updating recency position
- **`purgeExpired()`** — proactively evict expired entries
- Full **TypeScript** generics — `LRUCache<K, V>` · Zero dependencies · Node.js 18+

> For async loading, background refresh and request coalescing, see [`@disckit/caffeine`](https://www.npmjs.com/package/@disckit/caffeine).

## Installation

```sh
npm install @disckit/cache
yarn add @disckit/cache
pnpm add @disckit/cache
```

## TypeScript

Types are **bundled** — no extra install needed:

```ts
import { LRUCache, TTLCache, createCache } from '@disckit/cache';

const lru = new LRUCache<string, MyData>(100);
const ttl = new TTLCache<string, MyData>(100, 60_000);
```

## Usage

### `LRUCache` — pure LRU, no expiration

```js
const { LRUCache } = require('@disckit/cache');

const cache = new LRUCache(500); // max 500 entries

cache.set('guild:123', { prefix: '!', lang: 'pt' });
cache.get('guild:123'); // → { prefix: '!', lang: 'pt' }  (promotes to MRU)
cache.peek('guild:123'); // → same value, does NOT update recency
cache.has('guild:123'); // → true
cache.delete('guild:123');
cache.size; // → current entry count
```

When the cache reaches capacity, the **least recently used** entry is evicted automatically.

### `TTLCache` — LRU + expiration

```js
const { TTLCache } = require('@disckit/cache');

// Default TTL of 5 minutes for all entries
const cache = new TTLCache(200, 5 * 60 * 1000);

cache.set('user:456', userData);
cache.set('user:789', tempData, 30_000); // override: this entry expires in 30s

cache.get('user:456');    // → userData (if not expired)
cache.has('user:456');    // → true (checks expiry)

// Proactively remove expired entries (cache evicts lazily by default)
cache.purgeExpired();

// Iterate only live entries
for (const [key, value] of cache.entries()) {
  console.log(key, value); // expired entries are skipped
}
```

### `createCache()` — factory shortcut

```js
const { createCache } = require('@disckit/cache');

const lru = createCache(100);          // LRUCache, no expiration
const ttl = createCache(100, 60_000);  // TTLCache, 1 min TTL
```

### Real-world example — invite cache for a Discord bot

```js
const { TTLCache } = require('@disckit/cache');

// Cache invite codes per guild for 10 minutes
const inviteCache = new TTLCache(500, 10 * 60 * 1000);

client.on('guildMemberAdd', async member => {
  const cached = inviteCache.get(member.guild.id);
  if (!cached) {
    const invites = await member.guild.invites.fetch();
    inviteCache.set(member.guild.id, invites);
  }
  // compare cached vs current to detect which invite was used
});
```

## API Reference

### `LRUCache<K, V>`

| Method | Returns | Description |
|--------|---------|-------------|
| `get(key)` | `V \| undefined` | Get value and promote to MRU |
| `peek(key)` | `V \| undefined` | Get value without updating recency |
| `set(key, value)` | `void` | Set value, evicting LRU if at capacity |
| `has(key)` | `boolean` | Check if key exists |
| `delete(key)` | `boolean` | Remove key |
| `clear()` | `void` | Remove all entries |
| `entries()` | `IterableIterator` | LRU → MRU pairs |
| `keys()` | `K[]` | All keys LRU → MRU |
| `size` | `number` | Current entry count |

### `TTLCache<K, V>` — same as LRUCache plus:

| Method | Returns | Description |
|--------|---------|-------------|
| `set(key, value, ttlMs?)` | `void` | Optional per-entry TTL override |
| `purgeExpired()` | `number` | Evict all expired entries, returns count |
| `entries()` | `Array<[K, V]>` | Live entries only (expired skipped) |

## Links

- [npm](https://www.npmjs.com/package/@disckit/cache)
- [GitHub](https://github.com/disckit/disckit/tree/main/cache)
- [disckit monorepo](https://github.com/disckit/disckit)
