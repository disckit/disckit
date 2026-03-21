# Quick Start

The fastest way to get started is with `create-disckit-app` — an interactive CLI that scaffolds a complete Discord bot with `@disckit` packages pre-configured.

## Scaffold a new bot

```sh
npx create-disckit-app my-bot
```

The CLI will ask a few questions with arrow-key navigation:

```
  ⚡ create-disckit-app

  Language / Idioma
  ❯ English
    Português

  Project name: my-bot

  Language
  ❯ JavaScript
    TypeScript

  Module system
  ❯ CommonJS  — require / module.exports
    ESM       — import / export (type:module)

  Install dependencies: Yes
```

## Generated structure

```
my-bot/
├── src/
│   ├── index.js        ← bot client with cooldown + antiflood ready
│   ├── deploy.js       ← register slash commands with Discord
│   └── commands/
│       ├── ping.js     ← /ping — latency and uptime
│       └── info.js     ← /info — server information
├── .env.example
├── .gitignore
└── package.json
```

## Next steps

```sh
cd my-bot

# 1. Copy and fill in your tokens
cp .env.example .env

# 2. Register slash commands (run once)
node src/deploy.js

# 3. Start the bot
npm start
```

::: tip Dev mode
`npm run dev` uses `node --watch` to auto-restart the bot on file changes.
:::

## Manual setup

If you prefer to set things up yourself:

```sh
npm install discord.js @disckit/common @disckit/cooldown @disckit/antiflood dotenv
```

```js
// src/index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { CooldownManager } = require('@disckit/cooldown');
const { AntifloodManager, isBlocked, formatRetryAfter } = require('@disckit/antiflood');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const cooldowns = new CooldownManager({ default: 3000 });
const antiflood = new AntifloodManager({
  globalRule: { windowMs: 5000, maxHits: 5, penaltyMode: 'NONE' },
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const check = antiflood.check({
    userId:      interaction.user.id,
    guildId:     interaction.guildId ?? '*',
    commandName: interaction.commandName,
  });

  if (isBlocked(check)) {
    return interaction.reply({
      content: `⏳ Wait **${formatRetryAfter(check.retryAfterMs)}**.`,
      ephemeral: true,
    });
  }

  // run command...
});

client.login(process.env.BOT_TOKEN);
```
