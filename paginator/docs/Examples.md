# Examples — @disckit/paginator

## Discord bot — button navigation

```js
const { Paginator } = require('@disckit/paginator');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

async function interactionRun(interaction, data) {
  const allItems = await getItems(interaction.guildId);
  const pager    = new Paginator({ total: allItems.length, limit: 10 });

  const buildPayload = () => {
    const items          = pager.slice(allItems);
    const { prev, next, label } = pager.buttons();
    const embed = buildListEmbed(items, label);
    const row   = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Secondary).setDisabled(prev.disabled),
      new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Secondary).setDisabled(next.disabled),
    );
    return { embeds: [embed], components: [row] };
  };

  const msg = await interaction.followUp(buildPayload());

  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: i => i.user.id === interaction.user.id,
    idle: 30_000,
  });

  collector.on('collect', async i => {
    if (i.customId === 'prev') pager.prev();
    if (i.customId === 'next') pager.next();
    await i.update(buildPayload());
  });

  collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
}
```

## REST API with MongoDB

```js
const { fromQuery } = require('@disckit/paginator');

app.get('/api/users', async (req, res) => {
  const total = await User.countDocuments({ guild: req.params.guildId });
  const { skip, limit, meta } = fromQuery(req.query, { total, defaultLimit: 20, maxLimit: 50 });

  const users = await User.find({ guild: req.params.guildId })
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({ users, meta });
  // meta: { page, limit, total, totalPages, hasPrev, hasNext, from, to }
});
```

## Simple array slicing

```js
const { paginate } = require('@disckit/paginator');

const commands = client.commands.toJSON();
const page2    = paginate(commands, { page: 2, limit: 8 });

page2.items;       // commands 9–16
page2.from;        // 9
page2.to;          // 16
page2.totalPages;  // Math.ceil(commands.length / 8)
page2.hasPrev;     // true
```

## TypeScript

```ts
import { paginate, Paginator, fromQuery, PaginateResult } from '@disckit/paginator';
import type { Request, Response } from 'express';

interface User { id: string; name: string; }

const result: PaginateResult<User> = paginate(users, { page: 1, limit: 10 });

async function listUsers(req: Request, res: Response) {
  const total = await User.count();
  const { skip, limit, meta } = fromQuery(req.query as Record<string, string>, { total });
  const users = await User.find().skip(skip).limit(limit);
  res.json({ users, meta });
}
```
