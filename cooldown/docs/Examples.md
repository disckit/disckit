# Examples — @disckit/cooldown

## One manager for all commands

```js
const { CooldownManager } = require('@disckit/cooldown');

// Created once, shared across all commands
const cooldowns = new CooldownManager({
  default:     3_000,                    // 3s global default
  bypass:      [process.env.OWNER_ID],   // owner always bypasses
  sweepEveryMs: 60_000,                  // clean up expired entries every minute
});

// In your interactionCreate handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const durations = { gamble: 10_000, daily: 86_400_000, ban: 5_000 };
  const duration  = durations[interaction.commandName];

  const result = cooldowns.check(
    interaction.commandName,
    interaction.user.id,
    duration ? { duration } : undefined,
  );

  if (!result.ok) {
    return interaction.reply({
      content: `⏳ Wait **${result.remainingText}** before using \`/${interaction.commandName}\` again.`,
      ephemeral: true,
    });
  }

  // execute command...
});
```

## Per-guild cooldowns

```js
// Key combines userId + guildId for guild-scoped cooldowns
const key = `${interaction.user.id}:${interaction.guildId}`;
const result = cooldowns.check('starboard', key, { duration: 30_000 });
```

## Fire-and-forget after successful action

```js
// After the daily command runs successfully:
cooldowns.consume('daily', userId, { duration: 86_400_000 });
// No need to check the result — the cooldown is now active
```

## Peek for logging

```js
const state = cooldowns.peek('ban', userId);
if (!state.ok) {
  logger.info(`User ${userId} still on ban cooldown for ${state.remainingText}`);
}
// User is NOT put on cooldown — peek only reads
```

## TypeScript

```ts
import { CooldownManager, CooldownResult, CooldownManagerOptions } from '@disckit/cooldown';

const options: CooldownManagerOptions = {
  default:      3_000,
  bypass:       ['OWNER_ID'],
  sweepEveryMs: 60_000,
};

const cooldowns = new CooldownManager(options);

function checkCooldown(command: string, userId: string): CooldownResult {
  return cooldowns.check(command, userId);
}
```
