# API Reference — @disckit/paginator

## `paginate(items, options?)`

Slices an array for a given page and returns full pagination metadata.

**Options**

| Parameter | Type | Default |
|-----------|------|---------|
| `page` | `number` | `1` |
| `limit` | `number` | `10` |

**Returns** `PaginateResult<T>`

| Field | Type | Description |
|-------|------|-------------|
| `items` | `T[]` | Items for the current page |
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `total` | `number` | Total item count |
| `totalPages` | `number` | Total number of pages |
| `hasPrev` | `boolean` | Whether a previous page exists |
| `hasNext` | `boolean` | Whether a next page exists |
| `isEmpty` | `boolean` | Whether total is 0 |
| `isFirstPage` | `boolean` | Whether this is page 1 |
| `isLastPage` | `boolean` | Whether this is the last page |
| `from` | `number` | 1-indexed position of first item (0 if empty) |
| `to` | `number` | 1-indexed position of last item |

---

## `fromQuery(query, options)`

Converts `?page=&limit=` query params to skip/limit + metadata.

**Options**

| Parameter | Type | Default |
|-----------|------|---------|
| `total` | `number` | — required |
| `defaultLimit` | `number` | `20` |
| `maxLimit` | `number` | `100` |

Returns `{ skip, limit, page, meta }` where `meta` is a full `PaginateResult` minus `items`.

---

## `class Paginator`

### Constructor

```ts
new Paginator({ total: number, limit?: number, page?: number })
```

Throws `TypeError` if `total` is not a non-negative number.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `total` | `number` | Total items |
| `totalPages` | `number` | Total pages |
| `hasPrev` | `boolean` | Previous page exists |
| `hasNext` | `boolean` | Next page exists |
| `isEmpty` | `boolean` | Total is 0 |
| `isFirstPage` | `boolean` | On page 1 |
| `isLastPage` | `boolean` | On last page |
| `offset` | `number` | 0-indexed slice offset |

### Navigation methods

| Method | Returns | Description |
|--------|---------|-------------|
| `next()` | `this` | Advance to next page |
| `prev()` | `this` | Go back one page |
| `goTo(n)` | `this` | Jump to page n (clamped) |
| `first()` | `this` | Jump to page 1 |
| `last()` | `this` | Jump to last page |
| `reset()` | `this` | Alias for `first()` |

### Helper methods

| Method | Returns | Description |
|--------|---------|-------------|
| `slice(items)` | `T[]` | Current page items |
| `buttons(labels?)` | `ButtonsResult` | Discord prev/next button state |
| `window(size?)` | `number[]` | Page numbers centered on current page |
| `selectMenu(options?)` | `SelectMenuResult` | Discord select menu options |
| `clone()` | `Paginator` | Independent copy |
| `onChange(fn)` | `() => void` | Page change listener (returns unsubscribe) |
| `toJSON()` | `object` | Serializable snapshot |

### Static factories

| Method | Returns | Description |
|--------|---------|-------------|
| `Paginator.fromArray(items, options?)` | `{ paginator, items }` | Create from array, total derived automatically |
| `Paginator.fromJSON(data)` | `Paginator` | Restore from toJSON() snapshot |

### `buttons(labels?)`

```ts
buttons(labels?: { prev?: string; next?: string; label?: string }): {
  prev:  { disabled: boolean; label: string };
  next:  { disabled: boolean; label: string };
  label: string; // "Page 2 / 5"
}
```

### `window(size?)`

Returns page numbers centered around the current page, clamped to `[1, totalPages]`.

```js
// totalPages=20, page=10, size=5 → [8, 9, 10, 11, 12]
pager.window(5);
```

### `selectMenu(options?)`

| Option | Type | Default |
|--------|------|---------|
| `customId` | `string` | `"page-select"` |
| `labelPrefix` | `string` | `"Page"` |
| `maxOptions` | `number` | `25` |

---

## `class PaginatorStore`

Manages multiple `Paginator` instances keyed by string ID. Designed for bots where each user needs their own paginator.

### Constructor

```ts
new PaginatorStore({ ttlMs?: number, maxSize?: number, sweepEveryMs?: number })
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttlMs` | `number` | `0` | Inactivity TTL. 0 = no expiry |
| `maxSize` | `number` | `1000` | Max paginators (LRU eviction) |
| `sweepEveryMs` | `number` | `0` | Auto-sweep interval. 0 = disabled |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `create(key, options)` | `Paginator` | Create and store a paginator |
| `get(key)` | `Paginator \| undefined` | Get paginator (resets TTL) |
| `has(key)` | `boolean` | Check existence |
| `delete(key)` | `boolean` | Remove paginator |
| `clear()` | `void` | Remove all |
| `keys()` | `string[]` | All active keys |
| `next(key)` | `Paginator \| undefined` | Advance page for key |
| `prev(key)` | `Paginator \| undefined` | Go back for key |
| `goTo(key, page)` | `Paginator \| undefined` | Jump to page for key |
| `destroy()` | `void` | Stop timer and clear all |
| `size` | `number` | Count of active paginators |
