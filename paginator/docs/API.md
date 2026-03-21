# API Reference — @disckit/paginator

## `paginate(items, options?)`

Slices an array for a given page and returns full pagination metadata.

```ts
function paginate<T>(items: T[], options?: { page?: number; limit?: number }): PaginateResult<T>
```

**Options**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | 1-indexed page number. Clamped to `[1, totalPages]` |
| `limit` | `number` | `10` | Items per page. Minimum: `1` |

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
| `from` | `number` | 1-indexed position of the first item on this page (`0` when total is `0`) |
| `to` | `number` | 1-indexed position of the last item on this page |

---

## `fromQuery(query, options)`

Parses `?page=&limit=` query string params into skip/limit values for database queries.

```ts
function fromQuery(
  query: Record<string, string | number | undefined>,
  options: { total: number; defaultLimit?: number; maxLimit?: number }
): FromQueryResult
```

**Options**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `total` | `number` | — | Total document count (e.g. from `db.count()`). **Required** |
| `defaultLimit` | `number` | `20` | Fallback when `query.limit` is absent |
| `maxLimit` | `number` | `100` | Hard cap on limit to prevent abuse |

**Returns** `{ skip, limit, page, meta }` where `meta` is a full `PaginateResult` minus `items`.

---

## `class Paginator`

Stateful paginator. Holds the current page and exposes Discord-ready navigation helpers.

### Constructor

```ts
new Paginator(options: { total: number; limit?: number; page?: number })
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `total` | `number` | — | Total item count. **Required**. Must be `>= 0` |
| `limit` | `number` | `10` | Items per page |
| `page` | `number` | `1` | Initial page. Clamped to `[1, totalPages]` |

Throws `TypeError` if `total` is not a non-negative number.

### Properties (read-only)

| Property | Type | Description |
|----------|------|-------------|
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `total` | `number` | Total item count |
| `totalPages` | `number` | Total number of pages |
| `hasPrev` | `boolean` | Whether prev page exists |
| `hasNext` | `boolean` | Whether next page exists |
| `offset` | `number` | 0-indexed byte offset for current page (`(page-1) * limit`) |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `next()` | `this` | Advance to next page. No-op on last page |
| `prev()` | `this` | Go back to previous page. No-op on page 1 |
| `goTo(n)` | `this` | Jump to page `n`. Clamped to `[1, totalPages]` |
| `first()` | `this` | Jump to page 1 |
| `last()` | `this` | Jump to last page |
| `buttons(labels?)` | `ButtonsResult` | Discord-ready button state |
| `slice(items)` | `T[]` | Slice array for current page |
| `toJSON()` | `object` | Serializable snapshot |

### `buttons(labels?)`

```ts
buttons(labels?: { prev?: string; next?: string; label?: string }): {
  prev:  { disabled: boolean; label: string };
  next:  { disabled: boolean; label: string };
  label: string; // e.g. "Page 2 / 5"
}
```
