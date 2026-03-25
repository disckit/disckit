<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
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
  <p>Lightweight i18n engine with dot-notation keys, interpolation, pluralization and fallback locale.</p>
</div>

---

## Features

- **Dot-notation keys** — `t("errors.notFound")` resolves `{ errors: { notFound: "..." } }`
- **Interpolation** — `t("welcome", { name: "Alice" })` → `"Welcome, Alice!"`
- **Pluralization** — `t("items", { count: 3 })` picks the right plural form
- **Fallback locale** — missing keys fall through to the fallback language automatically
- **`reload(locale, messages)`** — hot-reload translations at runtime without restarting
- **`has(locale, key)`** — check if a key exists before translating
- **`locales()`** — list all loaded locale codes
- Full **TypeScript** types included · Zero dependencies · Node.js 18+

## Installation

```sh
npm install @disckit/i18n
yarn add @disckit/i18n
pnpm add @disckit/i18n
```

## Usage

### Basic setup

```js
const { I18n } = require('@disckit/i18n');

const i18n = new I18n({ fallback: 'en' });

i18n.load('en', {
  welcome: 'Welcome, {{name}}!',
  errors: { notFound: 'Not found.' },
  items: { one: '{{count}} item', other: '{{count}} items' },
});

i18n.load('pt', {
  welcome: 'Bem-vindo, {{name}}!',
  items: { one: '{{count}} item', other: '{{count}} itens' },
});

// Translate
i18n.t('en', 'welcome', { name: 'Alice' }); // → "Welcome, Alice!"
i18n.t('pt', 'welcome', { name: 'Alice' }); // → "Bem-vindo, Alice!"

// Fallback: 'pt' has no errors.notFound → falls back to 'en'
i18n.t('pt', 'errors.notFound'); // → "Not found."
```

### Pluralization

```js
i18n.t('en', 'items', { count: 1 }); // → "1 item"
i18n.t('en', 'items', { count: 5 }); // → "5 items"
i18n.t('pt', 'items', { count: 3 }); // → "3 itens"
```

### Hot-reload translations

```js
const fresh = JSON.parse(fs.readFileSync('./locales/pt.json', 'utf8'));
i18n.reload('pt', fresh); // fully replaces the locale — no restart needed
```

### Utility methods

```js
i18n.has('en', 'errors.notFound'); // → true
i18n.locales();                    // → ['en', 'pt']
```

## API Reference

### `new I18n(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fallback` | `string` | `"en"` | Locale to fall back to on missing keys |
| `missing` | `string` | `"__MISSING__{{key}}__"` | Template for missing keys |

### Instance methods

| Method | Returns | Description |
|--------|---------|-------------|
| `load(locale, messages)` | `this` | Merges messages into a locale (can call multiple times) |
| `reload(locale, messages)` | `this` | Replaces a locale entirely (hot-reload) |
| `t(locale, key, vars?)` | `string` | Translate a key with optional variables |
| `has(locale, key)` | `boolean` | Check if a key exists |
| `locales()` | `string[]` | List all loaded locale codes |

## Links

- [npm](https://www.npmjs.com/package/@disckit/i18n)
- [GitHub](https://github.com/disckit/disckit/tree/main/i18n)
- [disckit monorepo](https://github.com/disckit/disckit)
