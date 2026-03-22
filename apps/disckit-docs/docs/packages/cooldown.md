# @disckit/cooldown

Per-user, per-command cooldown manager with bypass list and duration overrides.

```sh
npm install @disckit/cooldown
```

[![npm](https://img.shields.io/npm/v/@disckit/cooldown?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/cooldown)

## Basic usage

```js
const { CooldownManager } = require('@disckit/cooldown');

const cooldowns = new CooldownManager({
  default:      3000,      // 3s default for all commands
  bypass:       ['OWNER_ID'],
  sweepEveryMs: 60_000,    // clean up expired entries every minute
});

const result = cooldowns.check('ping', interaction.user.id);

if (!result.ok) {
  return interaction.reply({
    content: `⏳ Wait **${result.remainingText}** before using this again.`,
    ephemeral: true,
  });
}
```

## Per-command duration override

```js
// 10s cooldown for /ban (same manager instance)
const result = cooldowns.check('ban', userId, { duration: 10_000 });

// Fire-and-forget for 24h daily reward
cooldowns.consume('daily', userId, { duration: 86_400_000 });
```

## Peek without applying

```js
// Check if on cooldown WITHOUT starting one
const state = cooldowns.peek('ping', userId);
if (!state.ok) {
  console.log(`Still has ${state.remainingText} left`);
}
```

## Bypass list

```js
cooldowns.addBypass('NEW_MOD_ID');
cooldowns.removeBypass('EX_MOD_ID');
cooldowns.isBypassed('OWNER_ID'); // → true
```

## CooldownResult

| Field | Type | Description |
|-------|------|-------------|
| `ok` | `boolean` | `true` if allowed to proceed |
| `remaining` | `number` | Ms until allowed again (0 if ok) |
| `remainingText` | `string` | Human-readable (e.g. `"2.5s"`) |
| `expiresAt` | `number` | Unix timestamp when cooldown expires |

## API

| Method | Description |
|--------|-------------|
| `check(command, key, opts?)` | Check and apply cooldown |
| `consume(command, key, opts?)` | Apply without returning result |
| `peek(command, key)` | Check without applying |
| `reset(command, key)` | Clear one user's cooldown |
| `resetCommand(command)` | Clear all users for a command |
| `resetAll()` | Clear everything |
| `addBypass(id)` | Add ID to bypass list |
| `removeBypass(id)` | Remove ID from bypass list |
| `isBypassed(id)` | Check if ID is bypassed |
| `destroy()` | Stop auto-sweep timer |
