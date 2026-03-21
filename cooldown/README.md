<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/cooldown"><img src="https://img.shields.io/npm/v/@disckit/cooldown.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/cooldown"><img src="https://img.shields.io/npm/dt/@disckit/cooldown.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/cooldown</h3>
  <p>Per-user, per-guild, per-command cooldown manager. Bypass lists and duration overrides included.</p>
</div>

---

## Features

- One `CooldownManager` instance handles **all commands** — keyed by `command:userId`
- **Bypass list** — owners and mods can skip cooldowns entirely
- **Per-check duration override** — different cooldowns per command in the same manager
- **`consume()`** — fire-and-forget for simple cases (no result needed)
- **`peek()`** — check state without starting a cooldown
- **Auto-sweep** — optional interval to clean expired entries
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/cooldown
yarn add @disckit/cooldown
pnpm add @disckit/cooldown
```

## TypeScript / ESM

Types are **bundled** — no extra install needed.  
Supports both **CommonJS** and **ESM**:

```ts
// ESM
import { CooldownManager } from '@disckit/cooldown';

// CommonJS
const { CooldownManager } = require('@disckit/cooldown');
```

## Usage

### Basic command cooldown

```js
const { CooldownManager } = require('@disckit/cooldown');

const cooldowns = new CooldownManager({
  default: 3000,         // 3s default for all commands
  bypass:  ['OWNER_ID'], // these users skip cooldowns
  sweepEveryMs: 60_000,  // clean up expired entries every minute
});

// In your interactionCreate handler:
const result = cooldowns.check('ping', interaction.user.id);

if (!result.ok) {
  return interaction.reply({
    content: `⏳ Wait **${result.remainingText}** before using this again.`,
    ephemeral: true,
  });
}

// execute command...
```

### Per-command duration overrides

```js
// Use a different duration just for /ban (same manager instance)
const result = cooldowns.check('ban', userId, { duration: 10_000 }); // 10s

// Or fire-and-forget for simple scenarios
cooldowns.consume('daily', userId, { duration: 86_400_000 }); // 24h
```

### Bypass list management

```js
// Add at startup
const cooldowns = new CooldownManager({ bypass: ['OWNER_ID', 'CO_OWNER_ID'] });

// Add/remove at runtime
cooldowns.addBypass('NEW_MOD_ID');
cooldowns.removeBypass('EX_MOD_ID');
cooldowns.isBypassed('OWNER_ID'); // → true
```

### Peek without applying

```js
// Check if user is on cooldown WITHOUT starting one
const state = cooldowns.peek('ping', userId);
if (!state.ok) {
  console.log(`User still has ${state.remainingText} left`);
}
```

### Reset controls

```js
cooldowns.reset('ping', userId);       // reset one user for one command
cooldowns.resetCommand('ping');        // reset all users for one command
cooldowns.resetAll();                  // nuclear option — clear everything

// Stats
cooldowns.stats(); // → { active: 12, bypassed: 3 }
```

## API Reference

### `new CooldownManager(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default` | `number` | `3000` | Default cooldown in ms |
| `bypass` | `string[]` | `[]` | IDs that always bypass |
| `sweepEveryMs` | `number` | `0` | Auto-sweep interval. `0` = disabled |

### `check(command, key, options?)` → `CooldownResult`

Checks and **applies** the cooldown if not active.

### `consume(command, key, options?)`

Applies the cooldown — returns `void`. Useful when you don't need the result.

### `peek(command, key)` → `CooldownResult`

Checks **without** applying. Useful for logging or UI.

### `CooldownResult`

| Field | Type | Description |
|-------|------|-------------|
| `ok` | `boolean` | `true` if allowed |
| `remaining` | `number` | Ms until allowed again (0 if ok) |
| `remainingText` | `string` | Human-readable remaining time (e.g. `"2.5s"`) |
| `expiresAt` | `number` | Unix timestamp when cooldown expires |

## Links

- [npm](https://www.npmjs.com/package/@disckit/cooldown)
- [GitHub](https://github.com/disckit/disckit/tree/main/cooldown)
- [disckit monorepo](https://github.com/disckit/disckit)
