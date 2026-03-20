<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit"><img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="546" alt="disckit" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/cooldown"><img src="https://img.shields.io/npm/v/@disckit/cooldown.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/cooldown"><img src="https://img.shields.io/npm/dt/@disckit/cooldown.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://www.npmjs.com/package/@disckit/cooldown"><img src="https://img.shields.io/badge/TypeScript-types-blue" alt="TypeScript types" /></a>
    <a href="https://github.com/disckit/disckit/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license" /></a>
  </p>
</div>

## About

`@disckit/cooldown` is a per-user, per-guild, per-command cooldown manager for bots. Supports bypass lists and per-check duration overrides.

Node.js 18.0.0 or newer is required.

## Installation

```sh
npm install @disckit/cooldown
yarn add @disckit/cooldown
pnpm add @disckit/cooldown
```

## Examples

```js
const { CooldownManager } = require("@disckit/cooldown");

const cooldowns = new CooldownManager({
  default: 3000,            // 3s default for all commands
  bypass:  ["OWNER_ID"],    // these users always bypass cooldowns
});

// In your command handler:
const result = cooldowns.check("ping", interaction.user.id);

if (!result.ok) {
  return interaction.reply(`Please wait ${result.remainingText} before using this command again.`);
}

// execute command...

// Per-command duration override
cooldowns.check("ban", userId, { duration: 10_000 }); // 10s just for /ban

// Reset manually (e.g. after a premium bypass)
cooldowns.reset("ping", userId);
cooldowns.resetCommand("ping"); // reset for all users

// Bypass list management
cooldowns.addBypass("MOD_ID");
cooldowns.removeBypass("MOD_ID");

// Stats
cooldowns.stats(); // → { active: 5, bypassed: 2 }
```

See the [docs](./docs) folder for detailed usage.

## Links

- [npm](https://www.npmjs.com/package/@disckit/cooldown)
- [GitHub](https://github.com/disckit/disckit/tree/main/packages/cooldown)
- [disckit monorepo](https://github.com/disckit/disckit)
