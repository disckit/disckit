# @disckit/caffeine

Async cache builder inspired by Java's Caffeine library. Background refresh, request coalescing, eviction callbacks, and stats. Zero external dependencies.

```sh
npm install @disckit/caffeine
```

[![npm](https://img.shields.io/npm/v/@disckit/caffeine?style=flat-square&color=ff468a)](https://www.npmjs.com/package/@disckit/caffeine)

## Quick start

```js
const { CacheBuilder } = require("@disckit/caffeine");

const cache = CacheBuilder.newBuilder()
  .maximumSize(1000)
  .expireAfterWrite(5 * 60_000)   // entries expire 5 min after write
  .refreshAfterWrite(60_000)       // background refresh after 1 min
  .buildAsync(async (key) => fetchFromDatabase(key)); // bound loader

const user = await cache.get("user:123"); // loads on first call
const same = await cache.get("user:123"); // hit — returns immediately
```

## Builder

### `CacheBuilder.newBuilder()`

Returns a new builder. Chain methods to configure the cache.

| Method | Description |
|--------|-------------|
| `.maximumSize(n)` | Maximum number of entries. Evicts LRU when full. |
| `.expireAfterWrite(ms)` | Expire entries `ms` milliseconds after they were last written. |
| `.expireAfterAccess(ms)` | Expire entries `ms` milliseconds after they were last **read** (idle timeout). |
| `.refreshAfterWrite(ms)` | After `ms` milliseconds, trigger a background reload on the next access. The caller receives the **stale value immediately** — no wait. |
| `.onEviction(fn)` | Callback `(key, value, reason)` fired on eviction. `reason` is `"size"`, `"expired"`, or `"manual"`. |
| `.buildAsync(loader)` | Binds an async loader `(key) => Promise<value>`. Returns a `CaffeineCache` with automatic loading. |
| `.build()` | Returns a `CaffeineCache` without a bound loader. Pass a loader per-call to `.get(key, loader)`. |

## CaffeineCache

### `get(key, loader?)`

Returns a `Promise<value>`.

- **Hit** — returns the cached value immediately.
- **Stale** (refreshAfterWrite exceeded) — returns the stale value immediately, triggers background refresh.
- **Expired / missing** — calls the bound loader or the per-call `loader`. Concurrent calls for the same key are coalesced into one loader invocation.

```js
// With bound loader (buildAsync)
const value = await cache.get("guild:456");

// Without bound loader (build)
const value = await cache.get("guild:456", (id) => fetchGuild(id));
```

### `set(key, value)`

Stores a value directly, bypassing the loader.

```js
cache.set("guild:456", guildData);
```

### `invalidate(key)`

Removes a key from the cache. The next `get()` will call the loader.

```js
cache.invalidate("guild:456");
```

### `invalidateAll()`

Removes all entries.

### `stats()`

Returns cache statistics.

```js
const s = cache.stats();
// { hits, misses, loads, errors, coalesced, evictions, refreshes }
```

| Field | Description |
|-------|-------------|
| `hits` | Requests that returned a cached value |
| `misses` | Requests that required a loader call |
| `loads` | Total loader invocations |
| `errors` | Loader calls that threw |
| `coalesced` | Concurrent requests that shared a single in-flight loader |
| `evictions` | Entries removed due to size or expiration |
| `refreshes` | Background refresh triggers |

## Examples

### Async guild config cache

```js
const { CacheBuilder } = require("@disckit/caffeine");

const configCache = CacheBuilder.newBuilder()
  .maximumSize(500)
  .expireAfterWrite(10 * 60_000)
  .refreshAfterWrite(2 * 60_000)
  .onEviction((key, value, reason) => {
    console.log(`Evicted ${key} (${reason})`);
  })
  .buildAsync(async (guildId) => {
    const row = await db.query("SELECT * FROM guilds WHERE id = $1", [guildId]);
    return row ?? null;
  });

// In a command:
const config = await configCache.get(interaction.guildId);
```

### Manual cache (no bound loader)

```js
const cache = CacheBuilder.newBuilder()
  .maximumSize(100)
  .expireAfterAccess(30_000)
  .build();

const data = await cache.get("key", async (k) => expensiveOperation(k));
```

### Using stats for monitoring

```js
setInterval(() => {
  const s = cache.stats();
  const hitRate = s.hits / (s.hits + s.misses) * 100;
  console.log(`Cache hit rate: ${hitRate.toFixed(1)}% | Evictions: ${s.evictions}`);
}, 60_000);
```
