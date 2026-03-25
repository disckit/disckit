<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/caffeine"><img src="https://img.shields.io/npm/v/@disckit/caffeine.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/caffeine"><img src="https://img.shields.io/npm/dt/@disckit/caffeine.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/caffeine</h3>
  <p>Caffeine-inspired async cache builder for Node.js. expireAfterWrite, expireAfterAccess, refreshAfterWrite, request coalescing.</p>
</div>

---

## Features

- **`CacheBuilder`** — fluent builder, mirrors the Java Caffeine API
- **`expireAfterWrite`** — entry expires N ms after it was last written
- **`expireAfterAccess`** — entry expires N ms after it was last read or written
- **`refreshAfterWrite`** — stale entries are refreshed transparently on the next `get()`
- **Request coalescing** — concurrent `get()` calls for the same key share one load, no thundering herd
- **`invalidate(key)`** / **`invalidateAll()`** — force-evict entries
- **`stats()`** — hit count, miss count, load count, hit ratio
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/caffeine
yarn add @disckit/caffeine
pnpm add @disckit/caffeine
```

## Usage

### Basic async loading cache

```js
const { CacheBuilder } = require('@disckit/caffeine');

const userCache = CacheBuilder.newBuilder()
  .maximumSize(1000)
  .expireAfterWrite(5 * 60_000)   // entries expire 5 min after write
  .buildAsync(async (userId) => {
    return db.users.findById(userId); // called only on cache miss
  });

// First call → loads from DB. Subsequent calls → from cache.
const user = await userCache.get('123456789');
```

### expireAfterAccess

```js
const sessionCache = CacheBuilder.newBuilder()
  .maximumSize(500)
  .expireAfterAccess(30 * 60_000) // expire if unused for 30 min
  .buildAsync(async (sessionId) => fetchSession(sessionId));
```

### refreshAfterWrite — serve stale, refresh in background

```js
const guildCache = CacheBuilder.newBuilder()
  .maximumSize(200)
  .expireAfterWrite(10 * 60_000)   // hard expiry at 10 min
  .refreshAfterWrite(2 * 60_000)   // background refresh at 2 min (serves stale while loading)
  .buildAsync(async (guildId) => fetchGuild(guildId));
```

### Manual invalidation

```js
guildCache.invalidate('guild:987');  // force next get() to reload
guildCache.invalidateAll();          // clear everything
```

### Stats

```js
const s = guildCache.stats();
// { hits: 482, misses: 38, loads: 38, hitRatio: 0.927 }
```

## API Reference

### `CacheBuilder.newBuilder()`

| Method | Description |
|--------|-------------|
| `.maximumSize(n)` | Max entries before LRU eviction |
| `.expireAfterWrite(ms)` | Expire N ms after last write |
| `.expireAfterAccess(ms)` | Expire N ms after last access |
| `.refreshAfterWrite(ms)` | Background-refresh N ms after write |
| `.buildAsync(loader)` | Build the cache with an async loader function |

### Cache instance

| Method | Description |
|--------|-------------|
| `get(key)` | `Promise<V>` — from cache or loader |
| `put(key, value)` | Manually insert a value |
| `invalidate(key)` | Remove one entry |
| `invalidateAll()` | Remove all entries |
| `stats()` | `{ hits, misses, loads, hitRatio }` |

## Links

- [npm](https://www.npmjs.com/package/@disckit/caffeine)
- [GitHub](https://github.com/disckit/disckit/tree/main/caffeine)
- [disckit monorepo](https://github.com/disckit/disckit)
