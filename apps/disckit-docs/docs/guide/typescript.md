# TypeScript

All `@disckit` packages ship with **bundled TypeScript types** — no `@types/` install needed.

## Usage

```ts
// ESM
import {
  StringUtils,
  TimeUtils,
  toDiscordTimestamp,
  isSnowflake,
  mentionUser,
  DISCORD,
  TIME,
} from '@disckit/common';

import { CooldownManager, CooldownResult } from '@disckit/cooldown';
import { AntifloodManager, CheckResult, FLOOD_RESULT } from '@disckit/antiflood';
import { Paginator, PaginateResult } from '@disckit/paginator';
import { I18n, createT } from '@disckit/i18n';
import { Permissions, PermissionsBits } from '@disckit/permissions';
```

## TypeScript + discord.js example

```ts
import {
  Client,
  ChatInputCommandInteraction,
  GatewayIntentBits,
} from 'discord.js';
import { CooldownManager, CooldownResult } from '@disckit/cooldown';
import { formatTime, toDiscordTimestamp } from '@disckit/common';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const cooldowns = new CooldownManager({ default: 3000 });

async function handlePing(interaction: ChatInputCommandInteraction): Promise<void> {
  const result: CooldownResult = cooldowns.check('ping', interaction.user.id);

  if (!result.ok) {
    await interaction.reply({
      content: `⏳ Wait **${result.remainingText}** before using this again.`,
      ephemeral: true,
    });
    return;
  }

  const uptime = formatTime(Math.floor((client.uptime ?? 0) / 1000));
  const joined = toDiscordTimestamp(interaction.guild?.createdAt ?? new Date(), 'R');

  await interaction.reply({
    embeds: [{
      color: 0x5865F2,
      title: '🏓 Pong!',
      fields: [
        { name: 'Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: 'Uptime',  value: uptime,                            inline: true },
        { name: 'Server',  value: `Created ${joined}`,               inline: false },
      ],
    }],
  });
}
```

## tsconfig recommendation

```json
{
  "compilerOptions": {
    "target":    "ES2022",
    "module":    "CommonJS",
    "strict":    true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```
