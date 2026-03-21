# Examples — @disckit/common

## String utilities in a bot command

```js
const { StringUtils, truncate, escapeMarkdown } = require('@disckit/common');

// Validate a color input from a user
if (!StringUtils.isHexColor(input)) {
  return interaction.reply('Invalid color. Use format: #FF5733');
}

// Truncate long embed descriptions
embed.setDescription(truncate(longText, 4000));

// Escape user input before putting in an embed
embed.addFields({ name: 'Reason', value: escapeMarkdown(reason) });

// Detect if a message tries to share invites
if (StringUtils.containsDiscordInvite(message.content)) {
  await message.delete();
}
```

## Time formatting

```js
const { TimeUtils, formatTime, formatTimeShort } = require('@disckit/common');

// Uptime in a /stats command
const uptimeMs = process.uptime() * 1000;
formatTimeShort(uptimeMs / 1000); // → "2h 30m 15s"

// Cooldown remaining
formatTime(remaining / 1000); // → "1 minuto, 30 segundos"

// Time until an event
const event = new Date('2026-12-31T00:00:00Z');
TimeUtils.getRemainingTime(event); // → "9 meses, 3 dias..."
```

## Array utilities

```js
const { ArrayUtils, chunk } = require('@disckit/common');

// Paginate manually
const pages = chunk(commands, 10);
const page1 = pages[0]; // first 10 commands

// Shuffle options for a quiz command
const shuffled = ArrayUtils.shuffle([...options]);

// Split winners and losers
const [winners, others] = ArrayUtils.partition(entries, e => e.tickets > 5);
```

## Async utilities

```js
const { AsyncUtils, sleep } = require('@disckit/common');

// Add delay between bulk operations
for (const guild of guilds) {
  await processGuild(guild);
  await sleep(100); // avoid rate limits
}

// Retry a flaky external API
const data = await AsyncUtils.retry(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  3,    // up to 3 attempts
  500,  // 500ms between retries
);

// Process 500 users in batches of 10
await AsyncUtils.batchProcess(users, 10, async user => {
  return db.users.update(user.id, { processed: true });
});
```
