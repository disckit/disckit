# @disckit/paginator — Documentation

## paginate(items, options?)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `page` | `number` | `1` | Current page (1-indexed) |
| `limit` | `number` | `10` | Items per page |

Returns `{ items, page, limit, total, totalPages, hasPrev, hasNext, from, to }`.

---

## fromQuery(query, options)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | `0` | Total document count |
| `defaultLimit` | `number` | `20` | Fallback limit |
| `maxLimit` | `number` | `100` | Cap to prevent abuse |

Returns `{ skip, limit, page, meta }`.

```js
const { skip, limit, meta } = fromQuery(req.query, { total: 200 });
const users = await db.users.find({}).skip(skip).limit(limit);
res.json({ users, meta });
```

---

## Paginator

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | — | **Required** |
| `limit` | `number` | `10` | Items per page |
| `page` | `number` | `1` | Initial page |

| Method | Description |
|--------|-------------|
| `next()` | Advance one page |
| `prev()` | Go back one page |
| `goTo(n)` | Jump to page N |
| `first()` / `last()` | Jump to first / last page |
| `buttons(labels?)` | Discord button state |
| `slice(items)` | Slice array for current page |
| `toJSON()` | Plain object snapshot |

### buttons()

```js
p.buttons();
// → { prev: { disabled: true, label: "◀" }, next: { disabled: false, label: "▶" }, label: "Page 1 / 5" }
```
