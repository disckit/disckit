# API Reference — @disckit/cooldown

## `class CooldownManager`

### Constructor

```ts
new CooldownManager(options?: CooldownManagerOptions)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default` | `number` | `3000` | Default cooldown duration in ms |
| `bypass` | `string[]` | `[]` | IDs that always bypass all cooldowns |
| `sweepEveryMs` | `number` | `0` | Interval to remove expired entries. `0` = disabled |

### `check(command, key, options?)` → `CooldownResult`

Checks and **applies** a cooldown for the given `command` + `key` combination.

- If not on cooldown: starts the cooldown and returns `{ ok: true }`
- If on cooldown: returns `{ ok: false, remaining, remainingText, expiresAt }`
- If `key` is in the bypass list: always returns `{ ok: true }`

### `consume(command, key, options?)`

Applies a cooldown without returning any result. Use this for fire-and-forget scenarios.

### `peek(command, key)` → `CooldownResult`

Checks the cooldown state **without** starting or extending it. Useful for logging or UI.

### `reset(command, key)`

Resets the cooldown for a specific command + key. The user can use the command immediately.

### `resetCommand(command)`

Resets all cooldowns for a command across all keys (all users).

### `resetAll()`

Clears all cooldowns.

### `addBypass(id)` → `this`

Adds an ID to the bypass list at runtime.

### `removeBypass(id)` → `this`

Removes an ID from the bypass list.

### `isBypassed(id)` → `boolean`

Returns `true` if the ID is on the bypass list.

### `stats()` → `CooldownStats`

Returns `{ active: number, bypassed: number }`.

- `active`: currently active (not expired) cooldown count
- `bypassed`: number of IDs on the bypass list

### `destroy()`

Clears all cooldowns and stops the sweep timer. Call when disposing the manager.

---

## `CooldownResult`

| Field | Type | Description |
|-------|------|-------------|
| `ok` | `boolean` | `true` if the action is allowed |
| `remaining` | `number` | Remaining cooldown in ms. `0` if allowed |
| `remainingText` | `string` | Human-readable time, e.g. `"2.5s"`, `"3m"`, `"1h"` |
| `expiresAt` | `number` | Unix timestamp (ms) when cooldown expires. `0` if allowed |

---

## `CheckOptions`

| Field | Type | Description |
|-------|------|-------------|
| `duration` | `number` | Override the default cooldown duration for this specific check |
