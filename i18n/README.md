<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit"><img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="546" alt="disckit" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/i18n"><img src="https://img.shields.io/npm/v/@disckit/i18n.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/i18n"><img src="https://img.shields.io/npm/dt/@disckit/i18n.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://www.npmjs.com/package/@disckit/i18n"><img src="https://img.shields.io/badge/TypeScript-types-blue" alt="TypeScript types" /></a>
    <a href="https://github.com/disckit/disckit/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license" /></a>
  </p>
</div>

## About

`@disckit/i18n` is a lightweight i18n engine with dot-notation keys, interpolation, pluralization and fallback locale.

Node.js 18.0.0 or newer is required.

## Installation

```sh
npm install @disckit/i18n
yarn add @disckit/i18n
pnpm add @disckit/i18n
```

## Examples

```js
const { I18n, createT } = require("@disckit/i18n");

const i18n = new I18n({ fallback: "en" });

i18n.load("en", {
  greet: "Hello, {{name}}!",
  items: { one: "{{n}} item", other: "{{n}} items" },
  commands: { ping: { reply: "Pong! Latency: {{ms}}ms" } },
});

i18n.load("pt", {
  greet: "Olá, {{name}}!",
  commands: { ping: { reply: "Pong! Latência: {{ms}}ms" } },
});

i18n.t("greet", "pt", { name: "Mundo" });          // → "Olá, Mundo!"
i18n.t("commands.ping.reply", "pt", { ms: 42 });   // → "Pong! Latência: 42ms"
i18n.t("items", "en", { n: 5 });                   // → "5 items"
i18n.t("greet", "es", { name: "Mundo" });          // → "Hello, Mundo!" (fallback)

// Pre-bound translator
const t = createT(i18n, "pt");
t("greet", { name: "Mundo" }); // → "Olá, Mundo!"
```

See the [docs](./docs) folder for detailed usage.

## Links

- [npm](https://www.npmjs.com/package/@disckit/i18n)
- [GitHub](https://github.com/disckit/disckit/tree/main/packages/i18n)
- [disckit monorepo](https://github.com/disckit/disckit)
