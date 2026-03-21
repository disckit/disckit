<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="480" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/i18n"><img src="https://img.shields.io/npm/v/@disckit/i18n.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/i18n"><img src="https://img.shields.io/npm/dt/@disckit/i18n.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="./types/index.d.ts"><img src="https://img.shields.io/badge/TypeScript-included-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  </p>
  <h3>@disckit/i18n</h3>
  <p>Lightweight i18n with dot-notation keys, interpolation, pluralization and locale fallback.</p>
</div>

---

## Features

- **Dot-notation** keys — `"commands.ping.reply"` resolves deeply nested objects
- **Interpolation** — `{{var}}` syntax with any number of variables
- **Pluralization** — `{ zero, one, other }` shapes with auto-selection by `n`
- **Fallback locale** — transparently falls back when a key is missing in the requested locale
- **Deep merge** — `load()` can be called multiple times; messages are merged, not replaced
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/i18n
yarn add @disckit/i18n
pnpm add @disckit/i18n
```

## TypeScript / ESM

Types are **bundled** — no extra install needed.  
Supports both **CommonJS** and **ESM**:

```ts
// ESM
import { I18n, createT } from '@disckit/i18n';

// CommonJS
const { I18n, createT } = require('@disckit/i18n');
```

## Usage

### Basic setup

```js
const { I18n, createT } = require('@disckit/i18n');

const i18n = new I18n({ fallback: 'en' });

i18n.load('en', {
  greet:    'Hello, {{name}}!',
  farewell: 'Goodbye, {{name}}!',
  commands: {
    ping: { reply: 'Pong! Latency: {{ms}}ms' },
    ban:  { success: '{{target}} was banned for: {{reason}}' },
  },
});

i18n.load('pt', {
  greet:    'Olá, {{name}}!',
  farewell: 'Até logo, {{name}}!',
  commands: {
    ping: { reply: 'Pong! Latência: {{ms}}ms' },
  },
  // ban.success not translated → falls back to English
});

i18n.t('greet', 'pt', { name: 'Mundo' });
// → "Olá, Mundo!"

i18n.t('commands.ping.reply', 'pt', { ms: 42 });
// → "Pong! Latência: 42ms"

i18n.t('commands.ban.success', 'pt', { target: 'user', reason: 'spam' });
// → "user was banned for: spam"  (fallback to English)
```

### Pluralization

```js
i18n.load('en', {
  messages: { zero: 'No messages', one: '{{n}} message', other: '{{n}} messages' },
  coins:    { one: '{{n}} coin',   other: '{{n}} coins' },
});

i18n.t('messages', 'en', { n: 0 });  // → "No messages"
i18n.t('messages', 'en', { n: 1 });  // → "1 message"
i18n.t('messages', 'en', { n: 42 }); // → "42 messages"
```

### Pre-bound translator (`createT`)

Useful when you have a user's locale and want to avoid passing it everywhere:

```js
const { createT } = require('@disckit/i18n');

// In a command handler:
const locale = interaction.locale?.startsWith('pt') ? 'pt' : 'en';
const t = createT(i18n, locale);

t('greet', { name: interaction.user.username });
// → "Olá, John!" or "Hello, John!" based on locale
```

### Multi-file locales

```js
const en = require('./locales/en.json');
const pt = require('./locales/pt.json');
const es = require('./locales/es.json');

const i18n = new I18n({ fallback: 'en' });
i18n.load('en', en).load('pt', pt).load('es', es);
```

## API Reference

### `new I18n(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fallback` | `string` | `"en"` | Locale used when a key is missing |
| `missing` | `string` | `"__MISSING__{{key}}__"` | Template for missing keys |

### `i18n.load(locale, messages)`

Deep-merges `messages` into the locale. Safe to call multiple times.

### `i18n.t(key, locale, vars?)`

Translates a key. Falls back to `fallback` locale if not found. Applies interpolation and pluralization.

### `i18n.has(key, locale)`

Returns `true` if the key exists in the locale or the fallback.

### `i18n.locales()`

Returns all loaded locale names as an array.

### `i18n.reload(locale, messages)`

Fully **replaces** a locale (unlike `load()` which merges). Useful for hot-reloading translations from disk without restarting.

```js
const fresh = JSON.parse(fs.readFileSync('./locales/pt-BR.json', 'utf8'));
i18n.reload('pt-BR', fresh);
```

### `i18n.unload(locale)` → `boolean`

Removes a locale from memory. Returns `true` if it existed. After calling, `t()` falls back to the fallback locale.

### `createT(i18n, locale)` → `TFunction`

Returns `(key, vars?) => string` pre-bound to the given locale.

## Links

- [npm](https://www.npmjs.com/package/@disckit/i18n)
- [GitHub](https://github.com/disckit/disckit/tree/main/i18n)
- [disckit monorepo](https://github.com/disckit/disckit)
