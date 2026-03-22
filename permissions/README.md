<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/permissions"><img src="https://img.shields.io/npm/v/@disckit/permissions.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/permissions"><img src="https://img.shields.io/npm/dt/@disckit/permissions.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/permissions</h3>
  <p>Human-readable Discord permission bitfields. No discord.js required.</p>
</div>

---

## Features

- Wraps Discord's `BigInt` permission bitfields in a clean, readable API
- **No discord.js dependency** — works in dashboards, REST APIs, standalone scripts
- `ADMINISTRATOR` always passes `has()` and `any()` checks automatically
- Immutable — `add()` and `remove()` return new instances
- Full **TypeScript** types with all 50 permission names · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/permissions
yarn add @disckit/permissions
pnpm add @disckit/permissions
```

## TypeScript / ESM

Types are **bundled** — no extra install needed.  
Supports both **CommonJS** and **ESM**:

```ts
// ESM
import { Permissions, PermissionsBits } from '@disckit/permissions';

// CommonJS
const { Permissions, PermissionsBits } = require('@disckit/permissions');
```

## Usage

### From a raw Discord bitfield

```js
const { Permissions } = require('@disckit/permissions');

// Raw bigint from Discord API (e.g. member.permissions)
const perms = Permissions.from(8n); // 8n = ADMINISTRATOR

perms.has('ADMINISTRATOR');   // → true
perms.has('SEND_MESSAGES');   // → true  (ADMINISTRATOR bypasses all checks)
perms.has('BAN_MEMBERS');     // → true
```

### From permission names

```js
const modPerms = new Permissions(['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES']);

modPerms.has('KICK_MEMBERS');          // → true
modPerms.has('ADMINISTRATOR');         // → false
modPerms.any(['KICK_MEMBERS', 'BAN_MEMBERS']); // → true  (at least one matches)

// What's missing from a required set?
modPerms.missing(['KICK_MEMBERS', 'MANAGE_ROLES']);
// → ['MANAGE_ROLES']
```

### Immutable add / remove

```js
const base = new Permissions(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY']);

const withEmbeds = base.add('EMBED_LINKS');
// base is unchanged — withEmbeds is a new instance

const reduced = withEmbeds.remove('SEND_MESSAGES');
reduced.toArray(); // → ['READ_MESSAGE_HISTORY', 'EMBED_LINKS']
```

### Dashboard usage (no discord.js)

```js
// Received from your API: member's permission bitfield as a string
const raw = req.body.permissions; // e.g. "2147483647"
const perms = new Permissions(BigInt(raw));

if (!perms.has('MANAGE_GUILD')) {
  return res.status(403).json({ error: 'Missing MANAGE_GUILD' });
}
```

### Using `PermissionsBits` directly

```js
const { PermissionsBits } = require('@disckit/permissions');

// Raw bigint constants — all 50 Discord permissions
PermissionsBits.ADMINISTRATOR;  // → 8n
PermissionsBits.BAN_MEMBERS;    // → 4n
PermissionsBits.SEND_MESSAGES;  // → 2048n
```

## API Reference

### `new Permissions(input?)`

`input` can be: `bigint`, `number`, `PermissionName`, or `PermissionName[]`

| Method | Returns | Description |
|--------|---------|-------------|
| `has(perms)` | `boolean` | All given permissions are set. `ADMINISTRATOR` always returns `true` |
| `any(perms)` | `boolean` | At least one of the given permissions is set |
| `missing(perms)` | `PermissionName[]` | Names in `perms` that are NOT set |
| `add(perms)` | `Permissions` | New instance with permissions added |
| `remove(perms)` | `Permissions` | New instance with permissions removed |
| `toArray()` | `PermissionName[]` | All set permission names |
| `toString()` | `string` | Bitfield as decimal string (safe for JSON) |
| `bitfield` | `bigint` | Raw permission bitfield |

### `diff(other)` → `{ added: PermissionName[], removed: PermissionName[] }`

Returns which permissions were added or removed compared to another bitfield. Useful for logging role changes in Event Log handlers.

```js
const before = new Permissions(['SEND_MESSAGES']);
const after  = new Permissions(['SEND_MESSAGES', 'MANAGE_MESSAGES']);
after.diff(before);
// → { added: ['MANAGE_MESSAGES'], removed: [] }
```

### `Permissions.from(input)` — static

Alias for `new Permissions(input)`.

### `PermissionsBits`

Frozen object with all 50 Discord permission flags as `bigint` constants.

## Contributing

Found a bug or want to improve this package? Check the [contributing guide](https://github.com/disckit/disckit/blob/main/README.md#contributing) in the monorepo root.

Before submitting a PR, make sure all tests pass:

```sh
node --test tests/run.js
```

## Links

- [npm](https://www.npmjs.com/package/@disckit/permissions)
- [GitHub](https://github.com/disckit/disckit/tree/main/permissions)
- [disckit monorepo](https://github.com/disckit/disckit)
