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
  <p>Universal pagination for arrays, REST APIs and Discord button/select navigation.</p>
</div>

---

## Features

- **`paginate()`** — slice any array with full metadata in one call
- **`Paginator`** — stateful class with `next()`, `prev()`, `goTo()`, `buttons()` and `selectMenu()`
- **`fromQuery()`** — parse `?page=&limit=` into skip/limit for any database
- **`isEmpty`** — zero-result detection without extra logic
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/paginator
yarn add @disckit/paginator
pnpm add @disckit/paginator
```

## TypeScript / ESM

```ts
// ESM
import { paginate, Paginator, fromQuery } from '@disckit/paginator';

// CommonJS
const { paginate, Paginator, fromQuery } = require('@disckit/paginator');
```

## Usage

### `paginate()` — slice an array

```js
const { paginate } = require('@disckit/paginator');

const result = paginate(users, { page: 2, limit: 10 });

result.items;       // users 11–20
result.page;        // 2
result.totalPages;  // Math.ceil(users.length / 10)
result.hasPrev;     // true
result.hasNext;     // true
result.isEmpty;     // false
result.from;        // 11
result.to;          // 20
```

### `Paginator` — Discord buttons

```js
const { Paginator } = require('@disckit/paginator');

const pager = new Paginator({ total: allItems.length, limit: 10 });

function buildMessage() {
  const { prev, next, label } = pager.buttons();
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Secondary).setDisabled(prev.disabled),
    new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Secondary).setDisabled(next.disabled),
  );
  return { embeds: [buildEmbed(pager.slice(allItems), label)], components: [row] };
}

collector.on('collect', async i => {
  if (i.customId === 'prev') pager.prev();
  if (i.customId === 'next') pager.next();
  await i.update(buildMessage());
});
```

### `Paginator` — Discord select menu

```js
const { Paginator } = require('@disckit/paginator');

const pager = new Paginator({ total: 120, limit: 10 });

// Generates Discord-ready options — windowed to max 25 around the current page
const menu = pager.selectMenu({ customId: 'help-pages', labelPrefix: 'Página' });
// menu.customId    → "help-pages"
// menu.placeholder → "Página 1 / 12"
// menu.options     → [{ label: 'Página 1', value: '1', default: true }, ...]

collector.on('collect', async i => {
  pager.goTo(Number(i.values[0]));
  await i.update(buildMessage());
});
```

### `isEmpty` — zero-result detection

```js
const pager = new Paginator({ total: results.length, limit: 10 });

if (pager.isEmpty) {
  return interaction.followUp('Nenhum resultado encontrado.');
}
```

### `fromQuery()` — REST API

```js
const { fromQuery } = require('@disckit/paginator');

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

| Option | Type | Default |
|--------|------|---------|
| `page` | `number` | `1` |
| `limit` | `number` | `10` |

Returns `PaginateResult<T>`: `items`, `page`, `limit`, `total`, `totalPages`, `hasPrev`, `hasNext`, `isEmpty`, `from`, `to`.

### `new Paginator(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | — | Total item count (**required**) |
| `limit` | `number` | `10` | Items per page |
| `page` | `number` | `1` | Initial page |

Methods: `next()` · `prev()` · `goTo(n)` · `first()` · `last()` · `slice(items)` · `buttons(labels?)` · `selectMenu(options?)` · `toJSON()`

Getters: `page` · `limit` · `total` · `totalPages` · `hasPrev` · `hasNext` · `isEmpty` · `offset`

### `fromQuery(query, options)`

| Option | Type | Default |
|--------|------|---------|
| `total` | `number` | — |
| `defaultLimit` | `number` | `20` |
| `maxLimit` | `number` | `100` |

Returns `{ skip, limit, page, meta }`.

## Contributing

Found a bug or want to improve this package? Check the [contributing guide](https://github.com/disckit/disckit/blob/main/README.md#contributing) in the monorepo root.

Before submitting a PR, make sure all tests pass:

```sh
node --test tests/run.js
```

## Links

- [npm](https://www.npmjs.com/package/@disckit/paginator)
- [GitHub](https://github.com/disckit/disckit/tree/main/paginator)
- [disckit monorepo](https://github.com/disckit/disckit)
