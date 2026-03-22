# @disckit/paginator

Universal pagination for arrays, REST APIs and Discord button/select navigation.

```sh
npm install @disckit/paginator
```

[![npm](https://img.shields.io/npm/v/@disckit/paginator?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/paginator)

## paginate() — slice an array

```js
const { paginate } = require('@disckit/paginator');

const result = paginate(users, { page: 2, limit: 10 });

result.items;       // users 11–20
result.page;        // 2
result.totalPages;  // Math.ceil(users.length / 10)
result.hasPrev;     // true
result.hasNext;     // true
result.isEmpty;     // false
result.from;        // 11  (1-indexed)
result.to;          // 20
```

## Paginator — Discord buttons

```js
const { Paginator } = require('@disckit/paginator');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const pager = new Paginator({ total: allItems.length, limit: 10 });

function buildMessage() {
  const { prev, next, label } = pager.buttons();
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('prev').setLabel('◀')
      .setStyle(ButtonStyle.Secondary).setDisabled(prev.disabled),
    new ButtonBuilder()
      .setCustomId('next').setLabel('▶')
      .setStyle(ButtonStyle.Secondary).setDisabled(next.disabled),
  );
  return { embeds: [buildEmbed(pager.slice(allItems), label)], components: [row] };
}

collector.on('collect', async i => {
  if (i.customId === 'prev') pager.prev();
  if (i.customId === 'next') pager.next();
  await i.update(buildMessage());
});
```

## Paginator — Discord select menu

```js
const menu = pager.selectMenu({ customId: 'pages', labelPrefix: 'Page' });
// {
//   customId: 'pages',
//   placeholder: 'Page 1 / 5',
//   options: [{ label: 'Page 1', value: '1', default: true }, ...]
// }

collector.on('collect', i => {
  pager.goTo(Number(i.values[0]));
  i.update(buildMessage());
});
```

## isEmpty — zero-result detection

```js
const pager = new Paginator({ total: results.length, limit: 10 });

if (pager.isEmpty) {
  return interaction.followUp({ content: 'No results found.', ephemeral: true });
}
```

## fromQuery() — REST API pagination

```js
const { fromQuery } = require('@disckit/paginator');

app.get('/users', async (req, res) => {
  const total = await db.users.count();
  const { skip, limit, meta } = fromQuery(req.query, { total });
  const users = await db.users.find().skip(skip).limit(limit);
  res.json({ users, meta });
  // meta → { page, limit, total, totalPages, hasPrev, hasNext, from, to }
});
```

## Paginator API

| Method / Getter | Description |
|----------------|-------------|
| `next()` | Advance to next page |
| `prev()` | Go to previous page |
| `goTo(n)` | Jump to page n |
| `first() / last()` | Jump to first/last page |
| `slice(items)` | Returns items for current page |
| `buttons(labels?)` | Discord button state |
| `selectMenu(opts?)` | Discord select menu options |
| `toJSON()` | Plain object snapshot |
| `page / totalPages` | Current page and total |
| `hasPrev / hasNext` | Navigation state |
| `isEmpty` | `true` when total === 0 |
| `offset` | Zero-indexed offset for slicing |
