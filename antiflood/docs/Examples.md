# Examples — @disckit/antiflood

## Full bot setup with per-command rules

```js
const { AntifloodManager, PENALTY_MODE, isBlocked, formatRetryAfter } = require('@disckit/antiflood');

const antiflood = new AntifloodManager({
  globalRule: { windowMs: 5000, maxHits: 5, penaltyMode: 'NONE' },
  whitelistRoleIds: [process.env.OWNER_ROLE_ID, process.env.MOD_ROLE_ID],
});

// Heavy commands get stricter rules
antiflood.setRule('gamble', {
  windowMs: 10_000, maxHits: 1,
  penaltyMode: PENALTY_MODE.ADDITIVE, penaltyStep: 15_000, maxPenalty: 120_000,
});
antiflood.setRule('leaderboard', {
  windowMs: 10_000, maxHits: 1,
  penaltyMode: PENALTY_MODE.ADDITIVE, penaltyStep: 20_000, maxPenalty: 60_000,
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const check = antiflood.check({
    userId:        interaction.user.id,
    guildId:       interaction.guildId ?? '*',
    commandName:   interaction.commandName,
    memberRoleIds: interaction.member?.roles?.cache.map(r => r.id) ?? [],
  });

  if (isBlocked(check)) {
    return interaction.reply({
      content: `⛔ Slow down! Try again in **${formatRetryAfter(check.retryAfterMs)}**.`,
      ephemeral: true,
    });
  }
  // run command...
});
```

## Exponential backoff for API endpoints

```js
antiflood.setRule('translate', {
  windowMs:    3000,
  maxHits:     2,
  penaltyMode: 'EXPONENTIAL', // 1s, 2s, 4s, 8s...
  penaltyStep: 1000,
  maxPenalty:  30_000,
});
```

## Unblock a user manually

```js
// After a moderator resolves a false positive
antiflood.reset({ userId: targetId, commandName: 'gamble', guildId: guildId });
```
