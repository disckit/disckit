<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
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
  <p>Placeholder substitution engine for Discord bots. No discord.js dependency.</p>
</div>

---

## Features

- Replace `{member:name}`, `{guild:memberCount}`, `{level}` and more in any string
- **No discord.js dependency** — works in dashboards and REST APIs with plain objects
- **`buildPreviewContext()`** — build a context from flat data for live message previews
- **`detectPlaceholders()`** — find all tokens in a string (for validation or UI hints)
- **`applyPresencePlaceholders()`** — bot status strings with `{servers}` and `{members}`
- **`VARIABLES`** registry — list and describe all available tokens programmatically
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/placeholders
yarn add @disckit/placeholders
pnpm add @disckit/placeholders
```

## TypeScript / ESM

Types are **bundled** — no extra install needed.  
Supports both **CommonJS** and **ESM**:

```ts
// ESM
import { applyPlaceholders, VARIABLES } from '@disckit/placeholders';

// CommonJS
const { applyPlaceholders, VARIABLES } = require('@disckit/placeholders');
```

## Usage

### Apply placeholders

```js
const { applyPlaceholders } = require('@disckit/placeholders');

const ctx = {
  guild:  { name: 'My Server', id: '123', memberCount: 1500, icon: '' },
  member: { id: '456', name: 'john', nick: 'John', dis: '0', tag: 'john#0', mention: '<@456>', avatar: '' },
};

applyPlaceholders('Welcome {member:mention} to {server}! We now have {count} members.', ctx);
// → "Welcome <@456> to My Server! We now have 1500 members."
```

### Dashboard message preview

The `buildPreviewContext()` helper creates a realistic preview context from flat data — useful for live preview in a web dashboard without needing Discord.js objects:

```js
const { applyPlaceholders, buildPreviewContext } = require('@disckit/placeholders');

// In your dashboard API route:
app.post('/preview', (req, res) => {
  const { template, guildName, memberCount } = req.body;
  const ctx = buildPreviewContext({ guildName, memberCount, memberName: 'example' });
  res.json({ result: applyPlaceholders(template, ctx) });
});
```

### Role placeholders

```js
const ctx = {
  guild:  { name: 'Server', id: '1', memberCount: 100 },
  member: { id: '2', name: 'john', nick: 'john', dis: '0', tag: 'john#0', mention: '<@2>', avatar: '' },
  roles: {
    resolve: (roleId) => {
      const role = guild.roles.cache.get(roleId);
      return role ? role.toString() : null; // null = silently removed
    },
  },
};

applyPlaceholders('You just got {role:987654321}!', ctx);
// → "You just got @Staff!" (or "You just got !" if role not found)
```

### Presence variables

```js
const { applyPresencePlaceholders, buildPresenceContext } = require('@disckit/placeholders');

const ctx = buildPresenceContext(250, 45000);
await applyPresencePlaceholders('In {servers} servers with {members} members', ctx);
// → "In 250 servers with 45000 members"

// Sharded bot — pass a resolver:
await applyPresencePlaceholders(statusText, {
  resolver: async () => {
    const servers = (await client.shard.fetchClientValues('guilds.cache.size')).reduce((a, b) => a + b, 0);
    return buildPresenceContext(servers, membersCount);
  },
});
```

### Detect and validate placeholders

```js
const { detectPlaceholders, hasPlaceholders } = require('@disckit/placeholders');

detectPlaceholders('Welcome {member:mention} to {server}!');
// → ['{member:mention}', '{server}']

hasPlaceholders('Hello, World!'); // → false
hasPlaceholders('{member:name}'); // → true
```

### Variable registry

```js
const { VARIABLES, getByGroup, findByKey } = require('@disckit/placeholders');

// All available tokens
VARIABLES.forEach(v => console.log(`${v.key} — ${v.description}`));

// By group
getByGroup('member'); // → all {member:*} variable definitions
getByGroup('guild');  // → all {guild:*} variable definitions

// Find a specific one
findByKey('{member:mention}');
// → { key: '{member:mention}', group: 'member', description: '...', example: '<@123>' }
```

## Available Placeholders

| Token | Group | Description |
|-------|-------|-------------|
| `{server}` / `{guild:name}` | guild | Server name |
| `{guild:id}` | guild | Server ID |
| `{count}` / `{guild:memberCount}` | guild | Total member count |
| `{guild:icon}` | guild | Server icon URL |
| `{member:id}` | member | Member's Discord ID |
| `{member:name}` | member | Username |
| `{member:nick}` | member | Display name |
| `{member:tag}` | member | Full tag (`username#0`) |
| `{member:mention}` | member | Clickable mention |
| `{member:avatar}` | member | Avatar URL |
| `{inviter:name}` / `{inviter:tag}` | inviter | Who sent the invite |
| `{invites}` | inviter | Inviter's effective invite count |
| `{level}` / `{xp}` / `{rank}` / `{coins}` | extras | Bot-specific values |
| `{role:ID}` | role | Role mention by ID (removed if not found) |
| `{servers}` / `{members}` | presence | Bot status only |

## Contributing

Found a bug or want to improve this package? Check the [contributing guide](https://github.com/disckit/disckit/blob/main/README.md#contributing) in the monorepo root.

Before submitting a PR, make sure all tests pass:

```sh
node --test tests/run.js
```

## Links

- [npm](https://www.npmjs.com/package/@disckit/placeholders)
- [GitHub](https://github.com/disckit/disckit/tree/main/placeholders)
- [disckit monorepo](https://github.com/disckit/disckit)
