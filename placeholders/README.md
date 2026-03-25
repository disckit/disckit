<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/placeholders"><img src="https://img.shields.io/npm/v/@disckit/placeholders.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/placeholders"><img src="https://img.shields.io/npm/dt/@disckit/placeholders.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/placeholders</h3>
  <p>Placeholder substitution engine for Discord bots and dashboards. Zero discord.js dependency.</p>
</div>

---

## Features

- **`applyPlaceholders(text, context)`** — replaces `{user}`, `{guild}`, `{member}` and 20+ tokens
- **`applyPresencePlaceholders(text, counts)`** — replaces `{servers}` and `{members}` for bot status messages, including sharded mode
- **No discord.js dependency** — works with plain context objects in both bot and dashboard (live preview)
- Unknown placeholders are left as-is — never throws, never removes unrecognised tokens
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/placeholders
yarn add @disckit/placeholders
pnpm add @disckit/placeholders
```

## Usage

### Message placeholders

```js
const { applyPlaceholders } = require('@disckit/placeholders');

const text = 'Welcome {user} to **{guild}**! You are member #{memberCount}.';

const result = applyPlaceholders(text, {
  user:        { id: '123', username: 'Alice', discriminator: '0', mention: '<@123>' },
  guild:       { id: '456', name: 'My Server', memberCount: 1024 },
});
// → "Welcome <@123> to **My Server**! You are member #1024."
```

### All available tokens

| Token | Value |
|-------|-------|
| `{user}` | User mention (`<@id>`) |
| `{user.id}` | User ID |
| `{user.name}` | Username |
| `{user.tag}` | `username#0000` |
| `{user.avatar}` | Avatar URL |
| `{guild}` | Server name |
| `{guild.id}` | Server ID |
| `{guild.memberCount}` | Total member count |
| `{guild.icon}` | Icon URL |
| `{member.nickname}` | Display name (nickname or username) |
| `{member.joinedAt}` | Join date (locale string) |
| `{inviter}` | Inviter mention |
| `{inviter.name}` | Inviter username |
| `{inviteCode}` | Invite code used |

### Presence placeholders (bot status)

```js
const { applyPresencePlaceholders } = require('@disckit/placeholders');

// Standalone (single process)
applyPresencePlaceholders('{servers} servers | {members} members', {
  servers: 42,
  members: 18500,
});
// → "42 servers | 18500 members"

// Sharded (async)
const result = await applyPresencePlaceholders('{servers} servers', {
  servers: await client.shard.fetchClientValues('guilds.cache.size')
    .then(r => r.reduce((a, b) => a + b, 0)),
});
```

## Links

- [npm](https://www.npmjs.com/package/@disckit/placeholders)
- [GitHub](https://github.com/disckit/disckit/tree/main/placeholders)
- [disckit monorepo](https://github.com/disckit/disckit)
