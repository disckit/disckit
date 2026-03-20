# API Reference — @disckit/antiflood

## `class AntifloodManager`

### Constructor

```ts
new AntifloodManager(options?: {
  globalRule?:      RuleConfig;
  whitelistRoleIds?: string[];
  enabled?:         boolean;
})
```

### `setRule(commandName, ruleConfig)` → `this`

Register a per-command rule. Overrides the global rule for that command name.

### `hasRule(commandName)` → `boolean`

Returns `true` if a per-command rule is registered for the given name.

### `addWhitelist(...roleIds)` / `removeWhitelist(roleId)` → `this`

Add/remove role IDs from the whitelist at runtime.

### `disable()` / `enable()` → `this`

Master on/off switch. When disabled, all checks return `ALLOWED`.

### `check(params)` → `CheckResult`

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `userId` | `string` | **Required** |
| `guildId` | `string` | Optional. Defaults to `"*"` (global bucket) |
| `commandName` | `string` | Optional. Used to look up per-command rule |
| `memberRoleIds` | `string[]` | Optional. Checked against whitelist |

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `result` | `string` | `FLOOD_RESULT` value |
| `retryAfterMs` | `number` | Ms until allowed (0 if ALLOWED/WHITELISTED) |
| `hitsInWindow` | `number` | Total hits in the current window |
| `penaltyUntil` | `number` | Timestamp when penalty expires (0 if none) |
| `rule` | `object` | The rule that was applied |

### `reset(params)` / `resetAll()`

Manually clear flood state.

### `activeBuckets` (property)

Number of currently tracked user buckets.

---

## `RuleConfig`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `windowMs` | `number` | `5000` | Sliding window size in ms |
| `maxHits` | `number` | `3` | Allowed hits before throttling |
| `penaltyMode` | `"NONE"\|"ADDITIVE"\|"EXPONENTIAL"` | `"ADDITIVE"` | Penalty growth strategy |
| `penaltyStep` | `number` | `5000` | Ms added per excess hit (ADDITIVE) or base (EXPONENTIAL) |
| `maxPenalty` | `number` | `60000` | Hard cap on penalty in ms |

---

## `FLOOD_RESULT`

| Value | Description |
|-------|-------------|
| `ALLOWED` | Request is within quota |
| `THROTTLED` | Quota exceeded, no penalty applied |
| `PENALIZED` | Quota exceeded + progressive penalty applied |
| `WHITELISTED` | Bypassed due to role whitelist |

---

## Helper functions

### `isBlocked(checkResult)` → `boolean`

Returns `true` when result is `THROTTLED` or `PENALIZED`.

### `formatRetryAfter(ms)` → `string`

Human-readable retry time delegated to `@disckit/common`.
