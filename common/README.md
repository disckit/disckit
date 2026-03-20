<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
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

- **`StringUtils`** — links, invites, hex colors, truncate, escape markdown, code blocks
- **`TimeUtils`** — format durations, parse HH:MM:SS, remaining time, uptime
- **`ArrayUtils`** — chunk, deduplicate, shuffle, flatten, partition
- **`RandomUtils`** — integers, floats, probability, array picks
- **`AsyncUtils`** — sleep, retry with backoff, timeout, batch processing
- **`DISCORD` / `TIME`** — Discord API limits and time constants
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/common
yarn add @disckit/common
pnpm add @disckit/common
```

## TypeScript

Types are **bundled** — no extra install needed:

```ts
import { StringUtils, TimeUtils, ArrayUtils, DISCORD, TIME } from '@disckit/common';
// or top-level:
import { formatTime, chunk, sleep, randomInt } from '@disckit/common';
```

## Usage

### String utilities

```js
const { StringUtils } = require('@disckit/common');

StringUtils.containsLink('Visit https://example.com');   // → true
StringUtils.containsDiscordInvite('discord.gg/abc');     // → true
StringUtils.isHexColor('#5865F2');                        // → true
StringUtils.truncate('Hello, World!', 8);                 // → "Hello..."
StringUtils.capitalize('hello world');                    // → "Hello world"
StringUtils.isBlank('   ');                               // → true
StringUtils.escapeMarkdown('**bold**');                   // → "\\*\\*bold\\*\\*"
StringUtils.codeBlock('const x = 1', 'js');              // → "```js\nconst x = 1\n```"
```

### Time utilities

```js
const { TimeUtils } = require('@disckit/common');

TimeUtils.formatTime(3661);          // → "1 hora, 1 minuto, 1 segundo"
TimeUtils.formatTimeShort(3661);     // → "1h 1m 1s"
TimeUtils.durationToMillis('1:30'); // → 90000
TimeUtils.formatUptime(3_600_000);  // → "1 hora"
TimeUtils.diffHours(date1, date2);  // → hour difference between two dates
```

### Array utilities

```js
const { ArrayUtils } = require('@disckit/common');

ArrayUtils.chunk([1,2,3,4,5], 2);              // → [[1,2],[3,4],[5]]
ArrayUtils.deduplicate([1,1,2,3,2]);           // → [1,2,3]
ArrayUtils.shuffle([1,2,3,4,5]);               // → shuffled array (in place)
ArrayUtils.partition([1,2,3,4], n => n%2===0); // → [[2,4],[1,3]]
ArrayUtils.last([1,2,3]);                      // → 3
```

### Async utilities

```js
const { AsyncUtils } = require('@disckit/common');

// Pause execution
await AsyncUtils.sleep(1000);

// Retry with backoff
const data = await AsyncUtils.retry(() => fetch(url).then(r => r.json()), 3, 500);

// Timeout
const result = await AsyncUtils.withTimeout(fetchSomething(), 5000);

// Batch API calls without overwhelming the server
const results = await AsyncUtils.batchProcess(items, 10, async item => {
  return await processItem(item);
});
```

### Random utilities

```js
const { RandomUtils } = require('@disckit/common');

RandomUtils.randomInt(100);             // → 0–99
RandomUtils.randomIntBetween(1, 6);    // → 1–6 (dice roll)
RandomUtils.chance(0.3);               // → true ~30% of the time
RandomUtils.randomFrom(['a','b','c']); // → random element
```

### Constants

```js
const { DISCORD, TIME } = require('@disckit/common');

DISCORD.MAX_MESSAGE_LENGTH;  // → 2000
DISCORD.MAX_EMBED_FIELDS;    // → 25
TIME.MINUTE;                 // → 60000  (ms)
TIME.HOUR;                   // → 3600000
TIME.DAY;                    // → 86400000
```

## Top-level exports

All utilities are also available as top-level named exports:

```js
const { sleep, chunk, randomInt, formatTime, truncate, containsLink } = require('@disckit/common');
```

## Links

- [npm](https://www.npmjs.com/package/@disckit/common)
- [GitHub](https://github.com/disckit/disckit/tree/main/common)
- [disckit monorepo](https://github.com/disckit/disckit)
