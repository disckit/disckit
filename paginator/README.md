<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
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

- **`paginate()`** — slice any array with full metadata in one call (`isEmpty`, `isFirstPage`, `isLastPage` included)
- **`Paginator`** — stateful class with `next()`, `prev()`, `goTo()`, `first()`, `last()`, `reset()`
- **`Paginator.window()`** — windowed page-number bar for rendering numbered page buttons
- **`Paginator.selectMenu()`** — Discord-ready select menu options, windowed to 25
- **`Paginator.fromArray()`** — create a paginator directly from an array, no need to pass `total` manually
- **`Paginator.fromJSON()`** — restore state from a serialized snapshot
- **`Paginator.clone()`** — independent copy of any paginator
- **`Paginator.onChange()`** — subscribe to page changes
- **`PaginatorStore`** — manage one paginator per user/message with optional TTL and auto-sweep
- **`fromQuery()`** — parse `?page=&limit=` into skip/limit for any database
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
import { paginate, Paginator, PaginatorStore, fromQuery } from '@disckit/paginator';

// CommonJS
const { paginate, Paginator, PaginatorStore, fromQuery } = require('@disckit/paginator');
```

---

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
result.isFirstPage; // false
result.isLastPage;  // false
result.from;        // 11
result.to;          // 20
```

---

### `Paginator` — Discord button navigation

```js
const { Paginator } = require('@disckit/paginator');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

async function run(interaction) {
  const allItems = await getItems(interaction.guildId);
  const pager    = new Paginator({ total: allItems.length, limit: 10 });

  function buildMessage() {
    const { prev, next, label } = pager.buttons();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Secondary).setDisabled(prev.disabled),
      new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Secondary).setDisabled(next.disabled),
    );
    return { embeds: [buildEmbed(pager.slice(allItems), label)], components: [row] };
  }

  const msg = await interaction.followUp(buildMessage());

  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: i => i.user.id === interaction.user.id,
    idle: 30_000,
  });

  collector.on('collect', async i => {
    if (i.customId === 'prev') pager.prev();
    if (i.customId === 'next') pager.next();
    await i.update(buildMessage());
  });

  collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
}
```

---

### `Paginator.window()` — numbered page buttons

Renders a row of numbered page buttons centered around the current page, exactly like most web paginators.

```js
const pager = new Paginator({ total: 200, limit: 10, page: 10 });

// totalPages=20, page=10, window=5 → [8, 9, 10, 11, 12]
const pages = pager.window(5);

const row = new ActionRowBuilder().addComponents(
  pages.map(p =>
    new ButtonBuilder()
      .setCustomId(`page:${p}`)
      .setLabel(String(p))
      .setStyle(p === pager.page ? ButtonStyle.Primary : ButtonStyle.Secondary)
  )
);

// On button click:
const page = parseInt(interaction.customId.split(':')[1]);
pager.goTo(page);
```

---

### `Paginator` — select menu navigation

```js
const pager = new Paginator({ total: 120, limit: 10 });

const menu = pager.selectMenu({ customId: 'help-pages', labelPrefix: 'Page' });
// menu.customId    → "help-pages"
// menu.placeholder → "Page 1 / 12"
// menu.options     → [{ label: 'Page 1', value: '1', default: true }, ...]

collector.on('collect', async i => {
  pager.goTo(Number(i.values[0]));
  await i.update(buildMessage());
});
```

---

### `Paginator.fromArray()` — factory shortcut

```js
const { paginator, items } = Paginator.fromArray(allUsers, { limit: 10 });
// paginator.total → allUsers.length (set automatically)
// items           → first page of users
```

---

### `Paginator.onChange()` — react to page changes

```js
const pager = new Paginator({ total: 50, limit: 10 });

const unsub = pager.onChange((page, paginator) => {
  console.log(`Page changed to ${page}`);
});

pager.next(); // → "Page changed to 2"
unsub();      // stop listening
pager.next(); // → (no callback)
```

---

### `PaginatorStore` — one paginator per user

The most important pattern for bots: each user gets their own paginator, automatically cleaned up after inactivity.

```js
const { PaginatorStore } = require('@disckit/paginator');

// Create once at bot startup
const store = new PaginatorStore({
  ttlMs:      2 * 60 * 1000, // expire after 2 min of inactivity
  sweepEveryMs: 60 * 1000,   // clean up expired entries every minute
});

// On command — create a paginator for this user
async function run(interaction) {
  const items = await getItems(interaction.guildId);
  const pager = store.create(interaction.user.id, { total: items.length, limit: 10 });
  await interaction.reply(buildMessage(pager, items));
}

// On button click
async function onButton(interaction) {
  const pager = store.get(interaction.user.id);
  if (!pager) return interaction.reply({ content: '⏳ Session expired.', ephemeral: true });

  if (interaction.customId === 'prev') store.prev(interaction.user.id);
  if (interaction.customId === 'next') store.next(interaction.user.id);
  await interaction.update(buildMessage(pager, items));
}

// On command end / collector end
store.delete(interaction.user.id);
```

---

### `fromQuery()` — REST API

```js
const { fromQuery } = require('@disckit/paginator');

app.get('/users', async (req, res) => {
  const total = await db.users.count();
  const { skip, limit, meta } = fromQuery(req.query, { total });
  const users = await db.users.find().skip(skip).limit(limit);
  res.json({ users, meta });
});
// meta → { page, limit, total, totalPages, hasPrev, hasNext, isEmpty, from, to }
```

---

## API Reference

### `paginate(items, options?)`

| Option | Type | Default |
|--------|------|---------|
| `page` | `number` | `1` |
| `limit` | `number` | `10` |

Returns `PaginateResult<T>`: `items`, `page`, `limit`, `total`, `totalPages`, `hasPrev`, `hasNext`, `isEmpty`, `isFirstPage`, `isLastPage`, `from`, `to`.

---

### `new Paginator(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | — | Total item count (**required**) |
| `limit` | `number` | `10` | Items per page |
| `page` | `number` | `1` | Initial page |

**Navigation:** `next()` · `prev()` · `goTo(n)` · `first()` · `last()` · `reset()`

**Helpers:** `buttons(labels?)` · `window(size?)` · `selectMenu(options?)` · `slice(items)` · `clone()` · `onChange(fn)` · `toJSON()`

**Getters:** `page` · `limit` · `total` · `totalPages` · `hasPrev` · `hasNext` · `isEmpty` · `isFirstPage` · `isLastPage` · `offset`

**Static:** `Paginator.fromArray(items, options?)` · `Paginator.fromJSON(data)`

---

### `new PaginatorStore(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttlMs` | `number` | `0` | Inactivity TTL. `0` = no expiry |
| `maxSize` | `number` | `1000` | Max paginators before LRU eviction |
| `sweepEveryMs` | `number` | `0` | Auto-sweep interval. `0` = disabled |

**Methods:** `create(key, options)` · `get(key)` · `has(key)` · `delete(key)` · `clear()` · `keys()` · `next(key)` · `prev(key)` · `goTo(key, page)` · `destroy()`

---

### `fromQuery(query, options)`

| Option | Type | Default |
|--------|------|---------|
| `total` | `number` | — |
| `defaultLimit` | `number` | `20` |
| `maxLimit` | `number` | `100` |

Returns `{ skip, limit, page, meta }`.

---

## Contributing

> **Contributing guide is not yet available.** External contributions will be supported in a future release.

## Links

- [npm](https://www.npmjs.com/package/@disckit/paginator)
- [GitHub](https://github.com/disckit/disckit/tree/main/paginator)
- [disckit monorepo](https://github.com/disckit/disckit)
