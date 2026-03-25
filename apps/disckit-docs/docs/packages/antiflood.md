# @disckit/antiflood

Advanced rate limiter with sliding window, progressive penalty and role whitelist.

```sh
npm install @disckit/antiflood
```

[![npm](https://img.shields.io/npm/v/@disckit/antiflood?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/antiflood)

## Basic setup

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
    content: `⛔ Wait **${formatRetryAfter(check.retryAfterMs)}** before using this again.`,
    ephemeral: true,
  });
}
```

## Per-command rules

Override the global rule for specific commands:

```js
const { PENALTY_MODE } = require('@disckit/antiflood');

// Heavy command — stricter limit with progressive penalty
antiflood.setRule('gamble', {
  windowMs:    10_000,
  maxHits:     1,
  penaltyMode: PENALTY_MODE.ADDITIVE,
  penaltyStep: 15_000,   // +15s per excess hit
  maxPenalty:  120_000,  // cap at 2 minutes
});

// Exponential backoff — doubles each time: 1s → 2s → 4s → 8s...
antiflood.setRule('api-call', {
  windowMs:    3000,
  maxHits:     2,
  penaltyMode: PENALTY_MODE.EXPONENTIAL,
  penaltyStep: 1000,
  maxPenalty:  30_000,
});
```

## Stats monitoring

```js
const s = antiflood.stats();
// { hits: 1240, blocked: 37, whitelisted: 5, ratio: 0.03 }

console.log(
  `${s.blocked} blocked / ${s.hits + s.blocked} total ` +
  `(${(s.ratio * 100).toFixed(1)}% block rate)`
);

// Reset counters without clearing flood state
antiflood.resetStats();
```

## RuleConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `windowMs` | `number` | `5000` | Sliding window size in ms |
| `maxHits` | `number` | `3` | Allowed hits per window |
| `penaltyMode` | `"NONE" \| "ADDITIVE" \| "EXPONENTIAL"` | `"ADDITIVE"` | How penalties grow |
| `penaltyStep` | `number` | `5000` | Ms added per excess hit |
| `maxPenalty` | `number` | `60000` | Hard cap on penalty duration |

## CheckResult

| Field | Type | Description |
|-------|------|-------------|
| `result` | `string` | `ALLOWED` · `THROTTLED` · `PENALIZED` · `WHITELISTED` |
| `retryAfterMs` | `number` | Ms until allowed again |
| `hitsInWindow` | `number` | Current hit count in window |
| `penaltyUntil` | `number` | Unix timestamp when penalty expires |

## API

| Method | Description |
|--------|-------------|
| `check(params)` | Check and record a hit. Returns `CheckResult` |
| `setRule(command, config)` | Register a per-command rule |
| `addWhitelist(...roleIds)` | Add role IDs to whitelist |
| `reset(params)` | Reset state for a specific user + command |
| `resetAll()` | Clear all flood state |
| `stats()` | Lifetime counters: hits, blocked, whitelisted, ratio |
| `resetStats()` | Clear counters without affecting flood state |
| `enable() / disable()` | Master switch |
| `activeBuckets` | Number of currently tracked buckets |
