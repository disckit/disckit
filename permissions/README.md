<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit"><img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="546" alt="disckit" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/permissions"><img src="https://img.shields.io/npm/v/@disckit/permissions.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/permissions"><img src="https://img.shields.io/npm/dt/@disckit/permissions.svg?maxAge=3600" alt="npm downloads" /></a>
  </p>
</div>

## About

`@disckit/permissions` is a human-readable Discord permission bitfield manager. No discord.js required.

Node.js 18.0.0 or newer is required.

## Installation

```sh
npm install @disckit/permissions
yarn add @disckit/permissions
pnpm add @disckit/permissions
```

## Examples

```js
const { Permissions } = require("@disckit/permissions");

// From a raw Discord bitfield (e.g. from a guild member object)
const perms = Permissions.from(8n);
perms.has("ADMINISTRATOR");      // → true
perms.has("SEND_MESSAGES");      // → true (ADMINISTRATOR bypasses all checks)

// Build from permission names
const modPerms = new Permissions(["KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_MESSAGES"]);
modPerms.has("KICK_MEMBERS");    // → true
modPerms.has("ADMINISTRATOR");   // → false

// Check if any match (useful for "can moderate" checks)
modPerms.any(["KICK_MEMBERS", "BAN_MEMBERS", "MODERATE_MEMBERS"]); // → true

// Find what's missing
modPerms.missing(["KICK_MEMBERS", "MANAGE_ROLES"]); // → ["MANAGE_ROLES"]

// Immutable add/remove
const updated = modPerms.add("MANAGE_ROLES");
const reduced = modPerms.remove("BAN_MEMBERS");

// All set permission names
modPerms.toArray(); // → ["KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_MESSAGES"]
```

See the [docs](./docs) folder for detailed usage.

## Links

- [npm](https://www.npmjs.com/package/@disckit/permissions)
- [GitHub](https://github.com/disckit/disckit/tree/main/packages/permissions)
- [disckit monorepo](https://github.com/disckit/disckit)
