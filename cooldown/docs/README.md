# @disckit/cooldown — Documentation

## new CooldownManager(options?)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default` | `number` | `3000` | Default cooldown in ms |
| `bypass` | `string[]` | `[]` | IDs that always bypass |
| `sweepEveryMs` | `number` | `0` | Background sweep interval |

---

## cooldowns.check(command, key, options?)

Checks and applies a cooldown.

```js
const result = cooldowns.check("ping", userId);
if (!result.ok) return reply(`Wait ${result.remainingText}`);
```

| Option | Type | Description |
|--------|------|-------------|
| `duration` | `number` | Override duration for this check |

Returns `{ ok, remaining, remainingText, expiresAt }`.

---

## cooldowns.peek(command, key)

Same as `check()` but does **not** apply the cooldown.

---

## Reset

```js
cooldowns.reset("ping", userId);        // one user
cooldowns.resetCommand("ping");         // all users for this command
cooldowns.resetAll();                   // everything
```

---

## Bypass

```js
cooldowns.addBypass(id);
cooldowns.removeBypass(id);
cooldowns.isBypassed(id);
```

---

## cooldowns.stats()

```js
cooldowns.stats(); // → { active: 5, bypassed: 2 }
```

---

## cooldowns.destroy()

Stops the sweep timer. Call on shutdown.
