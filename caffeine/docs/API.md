# API Reference — @disckit/caffeine

## `class CacheBuilder`

Fluent builder for `CaffeineCache`. Start with `CacheBuilder.newBuilder()`.

| Method | Description |
|--------|-------------|
| `maximumSize(n)` | Max entries. Evicts LRU when full |
| `expireAfterWrite(ms)` | Expire N ms after entry was last written |
| `expireAfterAccess(ms)` | Expire N ms after entry was last read (idle timeout) |
| `refreshAfterWrite(ms)` | Background reload after N ms; stale value returned immediately |
| `onEviction(fn)` | `(key, value, reason: 'size'\|'expired'\|'manual') => void` |
| `build()` | Build without bound loader — pass per-call loader to `get()` |
| `buildAsync(loader)` | Build with `async (key) => value` bound loader |

---

## `class CaffeineCache`

### `get(key, loader?)` → `Promise<T>`

Returns cached value. If missing/expired, calls the loader. If multiple callers race for the same key, only **1** loader call is made (request coalescing).

- If `refreshAfterWrite` is configured: returns stale value immediately and reloads in background.
- Throws if no loader is provided (neither bound nor per-call).

### `put(key, value)`

Manual write. Bypasses the loader. Resets the write/access timestamps.

### `getIfPresent(key)` → `T | undefined`

Returns the value if cached and not expired. Returns `undefined` otherwise. Does NOT trigger a load.

### `has(key)` → `boolean`

Returns `true` if the key is cached and not expired.

### `invalidate(key)` → `boolean`

Removes a key. Fires `onEviction` with `reason: 'manual'`.

### `invalidateAll()`

Removes all entries. Fires `onEviction` for each.

### `cleanUp()` → `number`

Proactively evicts all expired entries. Returns eviction count. The cache evicts lazily by default.

### `stats` (property)

```ts
{
  hits: number;      misses: number;    loads: number;
  errors: number;    coalesced: number; evictions: number;
  refreshes: number; size: number;      inflight: number;
}
```

### `resetStats()`

Resets all stat counters to zero.
