---
layout: home

hero:
  name: "disckit"
  text: "Utilities for Discord bots & dashboards."
  tagline: Zero dependencies · TypeScript included · CJS + ESM · Node.js 18+
  image:
    src: https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg
    alt: disckit
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/disckit/disckit
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/disckit

features:
  - icon: 🛠
    title: "@disckit/common"
    details: Foundation utilities — string, time, array, async, random, Discord constants, snowflake helpers and Discord timestamp tags.
    link: /packages/common
    linkText: View docs
  - icon: 🛡
    title: "@disckit/antiflood"
    details: Advanced rate limiter with sliding window, progressive penalty (additive or exponential), role whitelist and lifetime stats.
    link: /packages/antiflood
    linkText: View docs
  - icon: ☕
    title: "@disckit/caffeine"
    details: Caffeine-inspired async cache builder. Background refresh, stale-while-revalidate, request coalescing and eviction callbacks.
    link: /packages/caffeine
    linkText: View docs
  - icon: 💾
    title: "@disckit/cache"
    details: Pure LRU and TTL cache with O(1) get/set using a doubly-linked-list + Map. Per-entry TTL overrides.
    link: /packages/cache
    linkText: View docs
  - icon: 🔤
    title: "@disckit/placeholders"
    details: Placeholder engine for welcome messages and bot status. No discord.js required — works in dashboards too.
    link: /packages/placeholders
    linkText: View docs
  - icon: 📄
    title: "@disckit/paginator"
    details: Universal pagination for arrays, REST APIs and Discord button/select menus. isEmpty getter included.
    link: /packages/paginator
    linkText: View docs
  - icon: 🌍
    title: "@disckit/i18n"
    details: Lightweight i18n with dot-notation keys, interpolation, pluralization, locale fallback and hot-reload.
    link: /packages/i18n
    linkText: View docs
  - icon: 🔐
    title: "@disckit/permissions"
    details: Human-readable Discord permission bitfields. No discord.js required. Immutable operations and diff() for audit logging.
    link: /packages/permissions
    linkText: View docs
  - icon: ⏳
    title: "@disckit/cooldown"
    details: Per-user, per-command cooldown manager. Bypass list, duration overrides, peek without applying, auto-sweep.
    link: /packages/cooldown
    linkText: View docs
---
