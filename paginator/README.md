<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/paginator"><img src="https://img.shields.io/npm/v/@disckit/paginator.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/paginator"><img src="https://img.shields.io/npm/dt/@disckit/paginator.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/paginator</h3>
  <p>Universal pagination for arrays, REST APIs and Discord button navigation.</p>
</div>

---

## Features

- **`paginate()`** — slice any array with full metadata in one call
- **`Paginator`** — stateful class with `next()`, `prev()`, `goTo()`, Discord-ready `buttons()`
- **`fromQuery()`** — parse `?page=&limit=` query strings into skip/limit for any database
- Full **TypeScript** types included — no `@types/` needed
- Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/paginator
yarn add @disckit/paginator
pnpm add @disckit/paginator
```

## TypeScript

Types are **bundled** — no extra install needed:

```ts
import { paginate, Paginator, fromQuery, PaginateResult, PaginatorOptions } from '@disckit/paginator';
// or
const { paginate } = require('@disckit/paginator');
```

## Usage

### `paginate(items, options)` — slice an array

```js
const { paginate } = require('@disckit/paginator');

const users = await db.users.findAll();
const result = paginate(users, { page: 2, limit: 10 });

result.items;       // users 11–20
result.page;        // 2
result.totalPages;  // Math.ceil(users.length / 10)
result.hasPrev;     // true
result.hasNext;     // true
result.from;        // 11  (1-indexed position of first item)
result.to;          // 20
```

### `Paginator` — stateful navigation for Discord buttons

```js
const { Paginator } = require('@disckit/paginator');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const pager = new Paginator({ total: allItems.length, limit: 10 });

function buildMessage() {
  const { prev, next, label } = pager.buttons();
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Secondary).setDisabled(prev.disabled),
    new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Secondary).setDisabled(next.disabled),
  );
  const items = pager.slice(allItems);
  return { embeds: [buildEmbed(items, label)], components: [row] };
}

collector.on('collect', async i => {
  if (i.customId === 'prev') pager.prev();
  if (i.customId === 'next') pager.next();
  await i.update(buildMessage());
});
```

### `fromQuery(query, options)` — REST API pagination

```js
const { fromQuery } = require('@disckit/paginator');

// GET /users?page=2&limit=20
app.get('/users', async (req, res) => {
  const total = await db.users.count();
  const { skip, limit, meta } = fromQuery(req.query, { total });

  const users = await db.users.find().skip(skip).limit(limit);
  res.json({ users, meta });
});
// meta → { page, limit, total, totalPages, hasPrev, hasNext, from, to }
```

## API Reference

### `paginate(items, options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `page` | `number` | `1` | 1-indexed page number |
| `limit` | `number` | `10` | Items per page |

Returns a `PaginateResult<T>` with `items`, `page`, `limit`, `total`, `totalPages`, `hasPrev`, `hasNext`, `from`, `to`.

### `new Paginator(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | — | Total item count (**required**) |
| `limit` | `number` | `10` | Items per page |
| `page` | `number` | `1` | Initial page |

Methods: `next()` · `prev()` · `goTo(n)` · `first()` · `last()` · `buttons(labels?)` · `slice(items)` · `toJSON()`

### `fromQuery(query, options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | — | Total count from database (**required**) |
| `defaultLimit` | `number` | `20` | Fallback when `query.limit` is absent |
| `maxLimit` | `number` | `100` | Hard cap to prevent abuse |

Returns `{ skip, limit, page, meta }`.

## Links

- [npm](https://www.npmjs.com/package/@disckit/paginator)
- [GitHub](https://github.com/disckit/disckit/tree/main/paginator)
- [disckit monorepo](https://github.com/disckit/disckit)
