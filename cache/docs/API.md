# API Reference — @disckit/cache

## `class LRUCache<K, V>`

O(1) doubly-linked-list + Map LRU cache.

### Constructor

```ts
new LRUCache(maxSize: number)
```

Throws `TypeError` if `maxSize` is not a positive integer.

| Method | Returns | Description |
|--------|---------|-------------|
| `get(key)` | `V\|undefined` | Get value and promote entry to MRU position |
| `peek(key)` | `V\|undefined` | Get value **without** updating recency |
| `has(key)` | `boolean` | Check if key exists |
| `set(key, value)` | `void` | Write. Evicts LRU entry when at capacity |
| `delete(key)` | `boolean` | Remove key. Returns `true` if existed |
| `clear()` | `void` | Remove all entries |
| `entries()` | `IterableIterator<[K,V]>` | LRU → MRU ordered pairs |
| `keys()` | `K[]` | All keys LRU → MRU |
| `size` | `number` | Current entry count |
| `maxSize` | `number` | Capacity |

---

## `class TTLCache<K, V>`

LRUCache + per-entry expiration. Expired entries are **lazily** evicted on access.

### Constructor

```ts
new TTLCache(maxSize: number, ttlMs?: number)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxSize` | `number` | — | Max live entries |
| `ttlMs` | `number` | `0` | Default TTL in ms. `0` = no expiration |

| Method | Returns | Description |
|--------|---------|-------------|
| `get(key)` | `V\|undefined` | Returns value if not expired. Promotes to MRU |
| `has(key)` | `boolean` | Returns `true` if key exists and is not expired |
| `set(key, value, ttlMs?)` | `void` | Write with optional per-entry TTL override |
| `delete(key)` | `boolean` | Remove key |
| `clear()` | `void` | Remove all entries |
| `purgeExpired()` | `number` | Proactively evict expired entries. Returns count |
| `entries()` | `Array<[K,V]>` | All live (non-expired) entries |
| `keys()` | `K[]` | All live keys |
| `size` | `number` | Current entry count (includes stale-but-not-yet-evicted) |

---

## `createCache(maxSize?, ttlMs?)` → `LRUCache | TTLCache`

Factory helper.

- With `ttlMs > 0` → returns `TTLCache(maxSize, ttlMs)`
- Without `ttlMs` → returns `LRUCache(maxSize)`
