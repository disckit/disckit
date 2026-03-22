<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/create-disckit-app"><img src="https://img.shields.io/npm/v/create-disckit-app.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/create-disckit-app"><img src="https://img.shields.io/npm/dt/create-disckit-app.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="../../../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
  </p>
  <h3>create-disckit-app</h3>
  <p>Scaffold a Discord bot with <code>@disckit</code> packages pre-configured.</p>
</div>

---

## Usage

```sh
npx create-disckit-app my-bot
npm create disckit-app my-bot
```

That's it. The CLI will:

1. Copy the bot template into `my-bot/`
2. Run `npm install` (or `yarn` / `pnpm` if detected)
3. Print the next steps

---

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

---

## @disckit packages included

| Package | Used for |
|---------|----------|
| `@disckit/common` | `formatTime`, `DISCORD` constants |
| `@disckit/cooldown` | Per-user command cooldowns |
| `@disckit/antiflood` | Sliding window rate limiter |

---

## Links

- [npm](https://www.npmjs.com/package/create-disckit-app)
- [GitHub](https://github.com/disckit/disckit/tree/main/apps/create-disckit-app)
- [disckit monorepo](https://github.com/disckit/disckit)
