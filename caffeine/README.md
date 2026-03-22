<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
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
  <p>Caffeine-inspired async cache builder for Node.js.</p>
</div>

---

## Features

- **Builder pattern** — `CacheBuilder.newBuilder()...buildAsync(loader)`
- **`expireAfterWrite`** — entries expire N ms after last write
- **`expireAfterAccess`** — entries expire N ms after last read (idle timeout)
- **`refreshAfterWrite`** — return stale value immediately, reload in background
- **`onEviction`** — callback fired on every eviction with `reason: 'size' | 'expired' | 'manual'`
- **Request coalescing** — concurrent `get()` calls for the same key → **1 loader call**
- **Stats** — hits, misses, loads, errors, evictions, refreshes
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

Inspired by the [Java Caffeine library](https://github.com/ben-manes/caffeine) used by [Loritta](https://github.com/LorittaBot/Loritta).

## Installation

```sh
npm install @disckit/caffeine
yarn add @disckit/caffeine
pnpm add @disckit/caffeine
```

## TypeScript / ESM

Types are **bundled** — no extra install needed.  
Supports both **CommonJS** and **ESM**:

```ts
// ESM
import { CacheBuilder, CaffeineCache } from '@disckit/caffeine';

// CommonJS
const { CacheBuilder } = require('@disckit/caffeine');
```

## Usage

### Guild settings cache (most common use case)

```js
const { CacheBuilder } = require('@disckit/caffeine');

const guildCache = CacheBuilder.newBuilder()
  .maximumSize(500)
  .expireAfterAccess(30 * 60 * 1000)  // evict guilds idle for 30 min
  .refreshAfterWrite(5 * 60 * 1000)   // background refresh every 5 min
  .onEviction((key, value, reason) => {
    console.log(`Guild ${key} evicted: ${reason}`);
  })
  .buildAsync(async (guildId) => {
    let doc = await Guild.findById(guildId);
    if (!doc) doc = await new Guild({ _id: guildId }).save();
    return doc;
  });

// Usage in commands:
const settings = await guildCache.get(interaction.guildId);

// After a dashboard save:
guildCache.invalidate(guildId);
```

### Member stats cache

```js
const memberCache = CacheBuilder.newBuilder()
  .maximumSize(1000)
  .expireAfterWrite(10 * 60 * 1000) // expire 10 min after last write
  .buildAsync(async (key) => {
    const [guildId, memberId] = key.split('|');
    return MemberStats.findOne({ guild_id: guildId, member_id: memberId });
  });

const stats = await memberCache.get(`${guildId}|${memberId}`);
stats.xp += 10;
await stats.save();
memberCache.invalidate(`${guildId}|${memberId}`); // bust cache after save
```

### Per-call loader (no bound loader)

```js
const cache = CacheBuilder.newBuilder()
  .maximumSize(100)
  .expireAfterWrite(60_000)
  .build(); // no bound loader

// Pass loader on each call:
const data = await cache.get('api-response', async (key) => {
  return fetch(`https://api.example.com/${key}`).then(r => r.json());
});
```

### Manual writes with `put()`

```js
// Pre-warm the cache or write without loading
cache.put('guild:123', { prefix: '!', lang: 'pt' });
cache.getIfPresent('guild:123'); // → { prefix: '!', lang: 'pt' }
```

## API Reference

### `CacheBuilder.newBuilder()`

| Method | Description |
|--------|-------------|
| `.maximumSize(n)` | Max entries before LRU eviction |
| `.expireAfterWrite(ms)` | Expire N ms after last write |
| `.expireAfterAccess(ms)` | Expire N ms after last read |
| `.refreshAfterWrite(ms)` | Background refresh after N ms (stale-while-revalidate) |
| `.onEviction(fn)` | `(key, value, reason) => void` callback |
| `.build()` | Build without bound loader — pass loader per `get()` call |
| `.buildAsync(loader)` | Build with bound `async (key) => value` loader |

### `CaffeineCache`

| Method | Description |
|--------|-------------|
| `get(key, loader?)` | Get value, loading if missing or expired |
| `put(key, value)` | Manual write |
| `getIfPresent(key)` | Get only if cached and not expired |
| `has(key)` | Check existence |
| `invalidate(key)` | Remove one key |
| `invalidateAll()` | Clear entire cache |
| `cleanUp()` | Proactively evict expired entries |
| `stats` | `{ hits, misses, loads, errors, evictions, refreshes, size, inflight }` |

## Contributing

Found a bug or want to improve this package? Check the [contributing guide](https://github.com/disckit/disckit/blob/main/README.md#contributing) in the monorepo root.

Before submitting a PR, make sure all tests pass:

```sh
node --test tests/run.js
```

## Links

- [npm](https://www.npmjs.com/package/@disckit/caffeine)
- [GitHub](https://github.com/disckit/disckit/tree/main/caffeine)
- [disckit monorepo](https://github.com/disckit/disckit)
