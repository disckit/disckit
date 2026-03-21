# Introduction

**disckit** is a collection of lightweight, zero-dependency utilities for Discord bots and dashboards.

Every package ships with full **TypeScript** types and supports both **CommonJS** and **ESM**.

## Why disckit?

When building a Discord bot you end up writing the same things over and over — rate limiters, cooldown maps, pagination logic, permission checks. disckit extracts those patterns into well-tested, standalone packages so you can focus on your bot's logic instead.

## Packages

| Package | Description |
|---------|-------------|
| [`@disckit/common`](/packages/common) | Foundation utilities — string, time, array, async, random, Discord constants |
| [`@disckit/antiflood`](/packages/antiflood) | Advanced rate limiter with sliding window and progressive penalty |
| [`@disckit/caffeine`](/packages/caffeine) | Async cache builder — expireAfterWrite/Access, background refresh |
| [`@disckit/cache`](/packages/cache) | LRU and TTL cache with O(1) get/set |
| [`@disckit/placeholders`](/packages/placeholders) | Placeholder engine — `{member:name}`, `{guild:memberCount}` |
| [`@disckit/paginator`](/packages/paginator) | Universal pagination for arrays, REST APIs and Discord buttons |
| [`@disckit/i18n`](/packages/i18n) | i18n with dot-notation, interpolation, pluralization and hot-reload |
| [`@disckit/permissions`](/packages/permissions) | Human-readable Discord permission bitfields — no discord.js required |
| [`@disckit/cooldown`](/packages/cooldown) | Per-user, per-command cooldown manager with bypass list |

## Design principles

- **Zero dependencies** — every package works out of the box with no transitive deps
- **TypeScript first** — types are bundled, no `@types/` install needed
- **CJS + ESM** — works in Node.js bots (`require`) and Vite dashboards (`import`)
- **Node.js 18+** — modern APIs, no polyfills

## Meta-package

Install everything at once:

```sh
npm install disckit
```

Or pick only what you need:

```sh
npm install @disckit/common @disckit/cooldown @disckit/antiflood
```
