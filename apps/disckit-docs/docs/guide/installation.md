# Installation

## Requirements

- **Node.js** `>= 18.0.0`
- npm, yarn or pnpm

## Install everything

```sh
# npm
npm install disckit

# yarn
yarn add disckit

# pnpm
pnpm add disckit
```

## Install individually

Pick only the packages you need:

```sh
npm install @disckit/common
npm install @disckit/cooldown
npm install @disckit/antiflood
npm install @disckit/paginator
npm install @disckit/i18n
npm install @disckit/permissions
npm install @disckit/placeholders
npm install @disckit/cache
npm install @disckit/caffeine
```

## TypeScript

Types are **bundled** in every package — no extra `@types/` install needed.

```ts
import { formatTime, isSnowflake, toDiscordTimestamp } from '@disckit/common';
import { CooldownManager } from '@disckit/cooldown';
import { AntifloodManager } from '@disckit/antiflood';
```

::: info
TypeScript 4.7+ is recommended for the best experience with the bundled types.
:::
