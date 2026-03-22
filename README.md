<div align="center">
  <br />
  <p>
    <a href="https://disckit.vercel.app">
      <img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="546" alt="disckit" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/disckit"><img src="https://img.shields.io/npm/v/disckit.svg?maxAge=3600&style=flat-square&color=5865F2" alt="version" /></a>
    <a href="https://www.npmjs.com/package/disckit"><img src="https://img.shields.io/npm/dt/disckit.svg?maxAge=3600&style=flat-square&color=7289DA" alt="downloads" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT" /></a>
  </p>
  <p>
    <a href="https://disckit.vercel.app"><b>Documentation</b></a> &nbsp;·&nbsp;
    <a href="https://www.npmjs.com/package/disckit">npm</a> &nbsp;·&nbsp;
    <a href="https://github.com/disckit/disckit/issues">Issues</a>
  </p>
  <p><sup>Zero-dependency Node.js utilities for Discord bots and dashboards.</sup></p>
</div>

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`disckit`](./disckit) | [![npm](https://img.shields.io/npm/v/disckit.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/disckit) | Meta-package — installs everything + CLI |
| [`@disckit/common`](./common) | [![npm](https://img.shields.io/npm/v/@disckit/common.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/common) | Foundation utilities — string, time, array, async, random, Discord constants |
| [`@disckit/antiflood`](./antiflood) | [![npm](https://img.shields.io/npm/v/@disckit/antiflood.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/antiflood) | Rate limiter with sliding window, progressive penalty and role whitelist |
| [`@disckit/caffeine`](./caffeine) | [![npm](https://img.shields.io/npm/v/@disckit/caffeine.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/caffeine) | Async cache builder — expireAfterWrite/Access, background refresh, coalescing |
| [`@disckit/cache`](./cache) | [![npm](https://img.shields.io/npm/v/@disckit/cache.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/cache) | LRU and TTL cache with O(1) get/set |
| [`@disckit/placeholders`](./placeholders) | [![npm](https://img.shields.io/npm/v/@disckit/placeholders.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/placeholders) | Placeholder engine — `{member:name}`, `{guild:memberCount}` and more |
| [`@disckit/paginator`](./paginator) | [![npm](https://img.shields.io/npm/v/@disckit/paginator.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/paginator) | Universal pagination for arrays, REST APIs and Discord buttons/select menus |
| [`@disckit/i18n`](./i18n) | [![npm](https://img.shields.io/npm/v/@disckit/i18n.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/i18n) | i18n with dot-notation keys, interpolation, pluralization and hot-reload |
| [`@disckit/permissions`](./permissions) | [![npm](https://img.shields.io/npm/v/@disckit/permissions.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/permissions) | Human-readable Discord permission bitfields — no discord.js required |
| [`@disckit/cooldown`](./cooldown) | [![npm](https://img.shields.io/npm/v/@disckit/cooldown.svg?style=flat-square&color=5865F2)](https://www.npmjs.com/package/@disckit/cooldown) | Per-user, per-command cooldown manager with bypass list and auto-sweep |

## Apps

| App | Description |
|-----|-------------|
| [`create-disckit-app`](./apps/create-disckit-app) | CLI scaffold — `npx create-disckit-app my-bot` |
| [`disckit-docs`](./apps/disckit-docs) | Documentation site — [disckit.vercel.app](https://disckit.vercel.app) |

## Installation

```sh
npm install disckit           # everything at once
npm install @disckit/cooldown # or pick individual packages
```

## Versions API

Every publish auto-generates [`versions.json`](https://disckit.vercel.app/versions.json):

```
GET https://disckit.vercel.app/versions.json
```

## Contributing

> **Contributing guide is not yet available.** External contributions will be supported in a future release.
