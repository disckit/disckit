# @disckit/common

Foundation utilities for Discord bots and dashboards.

```sh
npm install @disckit/common
```

[![npm](https://img.shields.io/npm/v/@disckit/common?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/common)
[![downloads](https://img.shields.io/npm/dt/@disckit/common?style=flat-square&color=7289DA)](https://www.npmjs.com/package/@disckit/common)

## StringUtils

### isSnowflake

```js
const { isSnowflake } = require('@disckit/common');

isSnowflake('123456789012345678'); // → true
isSnowflake('12345');              // → false
isSnowflake('not-a-snowflake');    // → false
```

### Mentions

```js
const { mentionUser, mentionRole, mentionChannel } = require('@disckit/common');

mentionUser('123456789012345678');    // → "<@123456789012345678>"
mentionRole('987654321098765432');    // → "<@&987654321098765432>"
mentionChannel('111222333444555666'); // → "<#111222333444555666>"
```

### String helpers

```js
const { StringUtils } = require('@disckit/common');

StringUtils.containsLink('visit https://example.com');  // → true
StringUtils.containsDiscordInvite('discord.gg/abc');    // → true
StringUtils.isHexColor('#5865F2');                       // → true
StringUtils.truncate('Hello World!', 8);                 // → "Hello..."
StringUtils.truncateMiddle('very-long-string', 10);     // → "very…ring"
StringUtils.capitalize('hello world');                   // → "Hello world"
StringUtils.isBlank('   ');                              // → true
StringUtils.escapeMarkdown('**bold**');                  // → "\\*\\*bold\\*\\*"
StringUtils.codeBlock('const x = 1', 'js');             // → "```js\nconst x = 1\n```"
StringUtils.inlineCode('x');                             // → "`x`"
```

## TimeUtils

### formatTime / formatTimeShort

```js
const { TimeUtils } = require('@disckit/common');

TimeUtils.formatTime(3661);      // → "1 hora, 1 minuto, 1 segundo"
TimeUtils.formatTimeShort(3661); // → "1h 1m 1s"
TimeUtils.formatUptime(3_600_000); // → "1 hora"
TimeUtils.durationToMillis('1:30'); // → 90000
```

### toDiscordTimestamp

Renders natively in Discord as a live timestamp:

```js
const { toDiscordTimestamp } = require('@disckit/common');

toDiscordTimestamp(new Date(), 'R'); // → "<t:1711234567:R>" → "3 minutes ago"
toDiscordTimestamp(new Date(), 'D'); // → "<t:1711234567:D>" → "March 21, 2026"
toDiscordTimestamp(member.joinedAt, 'F'); // full date + time
```

| Format | Example output |
|--------|---------------|
| `t` | 9:41 PM |
| `T` | 9:41:30 PM |
| `d` | 11/28/2018 |
| `D` | November 28, 2018 |
| `f` | November 28, 2018 9:41 PM |
| `F` | Wednesday, November 28, 2018 9:41 PM |
| `R` | 3 years ago |

## ArrayUtils

```js
const { ArrayUtils } = require('@disckit/common');

ArrayUtils.chunk([1,2,3,4,5], 2);               // → [[1,2],[3,4],[5]]
ArrayUtils.deduplicate([1,1,2,3,2]);            // → [1,2,3]
ArrayUtils.shuffle([1,2,3,4,5]);                // → shuffled in-place
ArrayUtils.partition([1,2,3,4], n => n%2===0); // → [[2,4],[1,3]]
ArrayUtils.last([1,2,3]);                       // → 3
ArrayUtils.flatten([[1,2],[3,4]]);              // → [1,2,3,4]
```

## RandomUtils

```js
const { RandomUtils } = require('@disckit/common');

RandomUtils.randomInt(100);              // → 0–99
RandomUtils.randomIntBetween(1, 6);     // → 1–6 (dice roll)
RandomUtils.chance(0.3);                // → true ~30% of the time
RandomUtils.randomFrom(['a','b','c']);  // → random element
```

## AsyncUtils

```js
const { AsyncUtils } = require('@disckit/common');

await AsyncUtils.sleep(1000);

const data = await AsyncUtils.retry(
  () => fetch(url).then(r => r.json()),
  3,    // retries
  500   // delay between retries (ms)
);

const result = await AsyncUtils.withTimeout(fetchSomething(), 5000);

const results = await AsyncUtils.batchProcess(items, 10, async item => processItem(item));
```

## DISCORD constants

```js
const { DISCORD, TIME } = require('@disckit/common');

// Message limits
DISCORD.MAX_MESSAGE_LENGTH;       // 2000
DISCORD.MAX_EMBED_FIELDS;         // 25
DISCORD.MAX_EMBED_DESCRIPTION;    // 4096

// Interactions
DISCORD.MAX_SELECT_OPTIONS;       // 25
DISCORD.MAX_BUTTON_LABEL;         // 80
DISCORD.MAX_ACTION_ROWS;          // 5

// Modals
DISCORD.MAX_MODAL_TITLE;          // 45
DISCORD.MAX_MODAL_COMPONENTS;     // 5
DISCORD.MAX_MODAL_VALUE;          // 4000

// Components V2
DISCORD.MAX_MEDIA_GALLERY_ITEMS;  // 10

// Discord epoch (BigInt)
DISCORD.EPOCH;                    // 1420070400000n

// Time (ms)
TIME.SECOND;  // 1000
TIME.MINUTE;  // 60000
TIME.HOUR;    // 3600000
TIME.DAY;     // 86400000
TIME.WEEK;    // 604800000
```

## Top-level exports

All utilities are also available as direct named exports:

```js
const {
  sleep, chunk, randomInt, randomIntBetween, randomFrom,
  formatTime, formatTimeShort, toDiscordTimestamp,
  isSnowflake, mentionUser, mentionRole, mentionChannel,
  truncate, capitalize, isHexColor, containsLink,
  containsDiscordInvite, isBlank, escapeMarkdown, codeBlock,
  DISCORD, TIME, TIME_SECONDS,
} = require('@disckit/common');
```
