<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="546" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/disckit"><img src="https://img.shields.io/npm/v/disckit.svg?maxAge=3600&style=flat-square&color=5865F2" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/disckit"><img src="https://img.shields.io/npm/dt/disckit.svg?maxAge=3600&style=flat-square&color=7289DA" alt="npm downloads" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
  </p>
  <h3>disckit</h3>
  <p>Install all <code>@disckit</code> packages at once. Includes a CLI for version inspection.</p>
</div>

---

## About

`disckit` is the meta-package — one install pulls all `@disckit/*` utilities.  
All packages support both **CommonJS** and **ESM** and include full **TypeScript** types.

Node.js 18.0.0 or newer is required.

## Installation

```sh
npm install disckit
yarn add disckit
pnpm add disckit
```

Or install packages individually:

```sh
npm install @disckit/common
npm install @disckit/paginator
npm install @disckit/i18n
npm install @disckit/cooldown
npm install @disckit/antiflood
npm install @disckit/permissions
npm install @disckit/placeholders
npm install @disckit/cache
npm install @disckit/caffeine
```

## CLI

`disckit` ships with a command-line tool to inspect installed package versions.

```sh
# Install globally
npm install -g disckit

# Show all @disckit packages installed in the current project
disckit list

# Show info about a specific package
disckit info common

# Show this help
disckit help
```

## Packages

| Package | Description |
|---------|-------------|
| [`@disckit/common`](../common) | Foundation utilities — string, time, array, async, random, Discord constants |
| [`@disckit/antiflood`](../antiflood) | Advanced rate limiter with sliding window, progressive penalty and stats |
| [`@disckit/caffeine`](../caffeine) | Async cache builder — expireAfterWrite/Access, background refresh, request coalescing |
| [`@disckit/cache`](../cache) | LRU and TTL cache with O(1) get/set |
| [`@disckit/placeholders`](../placeholders) | Placeholder engine — `{member:name}`, `{guild:memberCount}` and more |
| [`@disckit/paginator`](../paginator) | Universal pagination — buttons, select menus, window, per-user `PaginatorStore` |
| [`@disckit/i18n`](../i18n) | i18n with dot-notation, interpolation, pluralization and hot-reload |
| [`@disckit/permissions`](../permissions) | Human-readable Discord permission bitfields — no discord.js required |
| [`@disckit/cooldown`](../cooldown) | Per-user, per-command cooldown manager with bypass list |

## Links

- [npm](https://www.npmjs.com/package/disckit)
- [GitHub](https://github.com/disckit/disckit)
