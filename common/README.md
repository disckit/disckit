<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/common"><img src="https://img.shields.io/npm/v/@disckit/common.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/common"><img src="https://img.shields.io/npm/dt/@disckit/common.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/common</h3>
  <p>Foundation utilities for Discord bots and dashboards.</p>
</div>

---

## Features

- **`StringUtils`** — links, invites, hex colors, snowflakes, mentions, truncate, escape markdown, code blocks
- **`TimeUtils`** — format durations, Discord timestamps, parse HH:MM:SS, remaining time, uptime
- **`ArrayUtils`** — chunk, deduplicate, shuffle, flatten, partition
- **`RandomUtils`** — integers, floats, probability, array picks
- **`AsyncUtils`** — sleep, retry with backoff, timeout, batch processing
- **`DISCORD`** — all Discord API limits (embeds, modals, select menus, Components V2, guild)
- **`TIME`** — time constants in milliseconds
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/common
yarn add @disckit/common
pnpm add @disckit/common
```

## Usage

```js
const { StringUtils, TimeUtils, ArrayUtils, RandomUtils, AsyncUtils, DISCORD, TIME } = require('@disckit/common');
```

### String utilities

```js
StringUtils.containsLink('Visit https://example.com');   // → true
StringUtils.containsDiscordInvite('discord.gg/abc');     // → true
StringUtils.isHexColor('#5865F2');                        // → true
StringUtils.isSnowflake('123456789012345678');            // → true
StringUtils.truncate('Hello, World!', 8);                 // → "Hello..."
StringUtils.truncateMiddle('abcdefghijklmnopqrstuvwxyz', 12); // → "abcde…vwxyz"
StringUtils.capitalize('hello world');                    // → "Hello world"
StringUtils.isBlank('   ');                               // → true
StringUtils.escapeMarkdown('**bold**');                   // → "\\*\\*bold\\*\\*"
StringUtils.codeBlock('const x = 1', 'js');              // → "```js\nconst x = 1\n```"
StringUtils.inlineCode('x');                             // → "`x`"
StringUtils.normalizeSpaces('  hello   world  ');        // → "hello world"
```

### Mentions

```js
const { mentionUser, mentionRole, mentionChannel } = require('@disckit/common');

mentionUser('123456789012345678');    // → "<@123456789012345678>"
mentionRole('987654321098765432');    // → "<@&987654321098765432>"
mentionChannel('111222333444555666'); // → "<#111222333444555666>"
```

### Time utilities

```js
TimeUtils.formatTime(3661);          // → "1 hora, 1 minuto, 1 segundo"
TimeUtils.formatTimeShort(3661);     // → "1h 1m 1s"
TimeUtils.durationToMillis('1:30'); // → 90000
TimeUtils.formatUptime(3_600_000);  // → "1 hora"
TimeUtils.msToSeconds(5000);         // → 5
TimeUtils.secondsToMs(5);            // → 5000

// Discord timestamp tags
toDiscordTimestamp(new Date(), 'R'); // → "<t:1711234567:R>"  (e.g. "3 minutes ago")
toDiscordTimestamp(new Date(), 'D'); // → "<t:1711234567:D>"  (e.g. "March 21, 2026")
toDiscordTimestamp(new Date(), 'F'); // → "<t:1711234567:F>"  (full date + time)
```

### Array utilities

```js
ArrayUtils.chunk([1,2,3,4,5], 2);              // → [[1,2],[3,4],[5]]
ArrayUtils.deduplicate([1,1,2,3,2]);           // → [1,2,3]
ArrayUtils.shuffle([1,2,3,4,5]);               // → shuffled (in place)
ArrayUtils.partition([1,2,3,4], n => n%2===0); // → [[2,4],[1,3]]
ArrayUtils.flatten([[1,2],[3,4]]);             // → [1,2,3,4]
ArrayUtils.last([1,2,3]);                      // → 3
```

### Async utilities

```js
await AsyncUtils.sleep(1000);

const data = await AsyncUtils.retry(() => fetch(url).then(r => r.json()), 3, 500);

const result = await AsyncUtils.withTimeout(fetchSomething(), 5000);

const results = await AsyncUtils.batchProcess(items, 10, async item => processItem(item));
```

### Random utilities

```js
RandomUtils.randomInt(100);             // → 0–99
RandomUtils.randomIntBetween(1, 6);    // → 1–6
RandomUtils.randomFloat();             // → 0.0–1.0
RandomUtils.chance(0.3);               // → true ~30% of the time
RandomUtils.randomFrom(['a','b','c']); // → random element
```

### Discord constants

```js
DISCORD.MAX_MESSAGE_LENGTH;      // → 2000
DISCORD.MAX_EMBED_FIELDS;        // → 25
DISCORD.MAX_SELECT_OPTIONS;      // → 25
DISCORD.MAX_MODAL_COMPONENTS;    // → 5
DISCORD.EPOCH;                   // → 1420070400000n

TIME.MINUTE;  // → 60000
TIME.HOUR;    // → 3600000
TIME.DAY;     // → 86400000
```

### Top-level convenience exports

```js
const {
  sleep, chunk, randomInt, randomFloat, formatTime, toDiscordTimestamp,
  isSnowflake, mentionUser, mentionRole, mentionChannel,
  truncate, truncateMiddle, capitalize, normalizeSpaces,
  isHexColor, containsLink, isBlank, escapeMarkdown, inlineCode
} = require('@disckit/common');
```

## Contributing

> **Contributing guide is not yet available.** External contributions will be supported in a future release.

## Links

- [npm](https://www.npmjs.com/package/@disckit/common)
- [GitHub](https://github.com/disckit/disckit/tree/main/common)
- [disckit monorepo](https://github.com/disckit/disckit)
