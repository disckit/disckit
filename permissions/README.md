<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
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

- **`Permissions`** — wrap any raw bitfield in a clean, readable API
- **`has(perms)`** — check if ALL given permissions are set (ADMINISTRATOR always passes)
- **`any(perms)`** — check if ANY of the given permissions are set
- **`toArray()`** — list all set permission names as strings
- **`toObject()`** — map every known permission to `true`/`false`
- **`add()` / `remove()`** — fluent bitfield manipulation
- **`missing(required)`** — returns the list of permissions the bitfield lacks
- **`Permissions.resolve(input)`** — convert names, arrays or bigints to a unified bigint
- **No discord.js dependency** — works standalone in dashboards, REST clients, or any Node.js app
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/permissions
yarn add @disckit/permissions
pnpm add @disckit/permissions
```

## Usage

### Check permissions

```js
const { Permissions } = require('@disckit/permissions');

// From a raw Discord bitfield (e.g. from the API)
const perms = new Permissions(8n); // ADMINISTRATOR

perms.has('ADMINISTRATOR'); // → true
perms.has('BAN_MEMBERS');   // → true  (ADMINISTRATOR passes all checks)
perms.any(['KICK_MEMBERS', 'BAN_MEMBERS']); // → true
```

### Build a bitfield from names

```js
const perms = new Permissions(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']);

perms.has(['SEND_MESSAGES', 'EMBED_LINKS']); // → true
perms.has('ADMINISTRATOR');                  // → false

perms.toArray();
// → ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
```

### Find missing permissions

```js
const memberPerms = new Permissions(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY']);
const required    = ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'];

memberPerms.missing(required);
// → ['EMBED_LINKS', 'ATTACH_FILES']
```

### Add / remove permissions

```js
const perms = new Permissions('SEND_MESSAGES');
perms.add('EMBED_LINKS').add('ATTACH_FILES');
perms.remove('SEND_MESSAGES');

perms.toArray(); // → ['EMBED_LINKS', 'ATTACH_FILES']
```

### Inspect as an object

```js
new Permissions(['BAN_MEMBERS']).toObject();
// → { ADMINISTRATOR: false, BAN_MEMBERS: true, KICK_MEMBERS: false, ... }
```

## API Reference

### `new Permissions(input?)`

`input` can be a `bigint`, `number`, permission name `string`, or `string[]`.

| Method | Returns | Description |
|--------|---------|-------------|
| `has(perms)` | `boolean` | ALL given permissions present |
| `any(perms)` | `boolean` | ANY given permission present |
| `missing(perms)` | `string[]` | Permissions from `perms` not in this bitfield |
| `add(perms)` | `this` | Adds permissions (chainable) |
| `remove(perms)` | `this` | Removes permissions (chainable) |
| `toArray()` | `string[]` | All set permission names |
| `toObject()` | `Record<string,boolean>` | Every permission mapped to its state |
| `valueOf()` | `bigint` | Raw bitfield |

### `Permissions.resolve(input)` → `bigint`

Converts any input format to a raw `bigint` bitfield.

## Links

- [npm](https://www.npmjs.com/package/@disckit/permissions)
- [GitHub](https://github.com/disckit/disckit/tree/main/permissions)
- [disckit monorepo](https://github.com/disckit/disckit)
