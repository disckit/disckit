<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/antiflood"><img src="https://img.shields.io/npm/v/@disckit/antiflood.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/antiflood"><img src="https://img.shields.io/npm/dt/@disckit/antiflood.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/antiflood</h3>
  <p>Advanced rate limiter for Discord bots — sliding window, progressive penalty and role whitelist.</p>
</div>

---

## Features

- **Sliding window** — tracks hits over a rolling time window, not a fixed interval
- **Progressive penalty** — `ADDITIVE` or `EXPONENTIAL` backoff on repeated abuse
- **Role whitelist** — skip checks entirely for specific roles (owners, mods)
- **Per-command rules** — different limits for heavy commands like `/gamble`
- **Guild isolation** — separate buckets per guild by default
- **`stats()`** — lifetime counters: hits, blocked, whitelisted, block ratio
- **Master switch** — `disable()` / `enable()` for maintenance
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/antiflood
yarn add @disckit/antiflood
pnpm add @disckit/antiflood
```

## Usage

### Basic setup

```js
const { AntifloodManager, isBlocked, formatRetryAfter } = require('@disckit/antiflood');

const antiflood = new AntifloodManager({
  globalRule: { windowMs: 5000, maxHits: 3, penaltyMode: 'NONE' },
  whitelistRoleIds: ['OWNER_ROLE_ID'],
});

// In your interactionCreate handler:
const check = antiflood.check({
  userId:        interaction.user.id,
  guildId:       interaction.guildId,
  commandName:   interaction.commandName,
  memberRoleIds: interaction.member.roles.cache.map(r => r.id),
});

if (isBlocked(check)) {
  return interaction.reply({
    content: `⛔ Slow down! Try again in ${formatRetryAfter(check.retryAfterMs)}.`,
    ephemeral: true,
  });
}
```

### Per-command rules

```js
const { AntifloodManager, PENALTY_MODE } = require('@disckit/antiflood');

const antiflood = new AntifloodManager({
  globalRule: { windowMs: 5000, maxHits: 5, penaltyMode: 'NONE' },
});

// Stricter rule for expensive commands
antiflood.setRule('gamble', {
  windowMs:    10_000,
  maxHits:     1,
  penaltyMode: PENALTY_MODE.ADDITIVE,
  penaltyStep: 15_000,  // +15s per excess hit
  maxPenalty:  120_000, // cap at 2 minutes
});

// Exponential backoff for API-heavy commands
antiflood.setRule('translate', {
  windowMs:    3000,
  maxHits:     2,
  penaltyMode: PENALTY_MODE.EXPONENTIAL, // doubles: 1s → 2s → 4s → 8s...
  penaltyStep: 1000,
  maxPenalty:  30_000,
});
```

### Stats monitoring

```js
const s = antiflood.stats();
// → { hits: 1240, blocked: 37, whitelisted: 5, ratio: 0.03 }

console.log(`${s.blocked} blocked / ${s.hits + s.blocked} total`);
antiflood.resetStats();
```

### Manual reset

```js
antiflood.reset({ userId: 'USER_ID', commandName: 'gamble', guildId: 'GUILD_ID' });
antiflood.resetAll();
```

## API Reference

### `new AntifloodManager(options?)`

| Option | Type | Description |
|--------|------|-------------|
| `globalRule` | `RuleConfig` | Default rule for all commands |
| `whitelistRoleIds` | `string[]` | Role IDs that always bypass checks |
| `enabled` | `boolean` | Master switch. Default: `true` |

### `RuleConfig`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `windowMs` | `number` | `5000` | Sliding window size in ms |
| `maxHits` | `number` | `3` | Allowed hits per window |
| `penaltyMode` | `"NONE"│"ADDITIVE"│"EXPONENTIAL"` | `"ADDITIVE"` | How penalties grow |
| `penaltyStep` | `number` | `5000` | Ms added per excess hit |
| `maxPenalty` | `number` | `60000` | Hard cap on penalty duration |

### `check(params)` → `CheckResult`

| Param | Type | Description |
|-------|------|-------------|
| `userId` | `string` | **Required** |
| `guildId` | `string` | Optional. Defaults to `"*"` (global) |
| `commandName` | `string` | Optional. Used to look up per-command rule |
| `memberRoleIds` | `string[]` | Optional. Checked against whitelist |

### Helpers

`isBlocked(result)` → `boolean` — true when `THROTTLED` or `PENALIZED`

`formatRetryAfter(ms)` → `string` — e.g. `"2m 30s"`

### `FLOOD_RESULT`

`"ALLOWED"` · `"THROTTLED"` · `"PENALIZED"` · `"WHITELISTED"`

## Contributing

> **Contributing guide is not yet available.** External contributions will be supported in a future release.

## Links

- [npm](https://www.npmjs.com/package/@disckit/antiflood)
- [GitHub](https://github.com/disckit/disckit/tree/main/antiflood)
- [disckit monorepo](https://github.com/disckit/disckit)
