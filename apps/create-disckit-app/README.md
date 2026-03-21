# create-disckit-app

Scaffold a Discord bot with `@disckit` packages pre-configured.

## Usage

```sh
npx create-disckit-app my-bot
```

That's it. The CLI will:

1. Copy the bot template into `my-bot/`
2. Run `npm install` (or `yarn`/`pnpm` if detected)
3. Print the next steps

## What's included

```
my-bot/
  src/
    index.js        → bot client with cooldown + antiflood ready
    deploy.js       → register slash commands
    commands/
      ping.js       → /ping — latency and uptime
      info.js       → /info — server info
  .env.example      → BOT_TOKEN, CLIENT_ID, TEST_GUILD_ID
  .gitignore
  package.json
  README.md
```

## @disckit packages included

| Package | Used for |
|---------|----------|
| `@disckit/common` | `formatTime`, `DISCORD` constants |
| `@disckit/cooldown` | Per-user command cooldowns |
| `@disckit/antiflood` | Sliding window rate limiter |

## Next steps after scaffolding

```sh
cd my-bot
# Fill in .env with your BOT_TOKEN, CLIENT_ID and TEST_GUILD_ID
node src/deploy.js   # register slash commands
npm start            # start the bot
```

## Links

- [npm](https://www.npmjs.com/package/create-disckit-app)
- [GitHub](https://github.com/disckit/disckit/tree/main/apps/create-disckit-app)
- [disckit monorepo](https://github.com/disckit/disckit)
