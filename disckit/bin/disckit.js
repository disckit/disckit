#!/usr/bin/env node
// disckit CLI — inspect @disckit packages in your project

"use strict";

const path = require("path");
const fs   = require("fs");

// ── All packages in the ecosystem ─────────────────────────────────────────────

const PACKAGES = [
  { name: "common",       desc: "Foundation utilities — string, time, array, async, random, Discord constants" },
  { name: "antiflood",    desc: "Advanced rate limiter with sliding window and progressive penalty" },
  { name: "caffeine",     desc: "Async cache builder — expireAfterWrite/Access, background refresh" },
  { name: "cache",        desc: "LRU and TTL cache with O(1) get/set" },
  { name: "placeholders", desc: "Placeholder engine — {member:name}, {guild:memberCount} and more" },
  { name: "paginator",    desc: "Universal pagination for arrays, REST APIs and Discord buttons" },
  { name: "i18n",         desc: "i18n with dot-notation, interpolation, pluralization and hot-reload" },
  { name: "permissions",  desc: "Human-readable Discord permission bitfields — no discord.js required" },
  { name: "cooldown",     desc: "Per-user, per-command cooldown manager with bypass list" },
];

// ── Colors ────────────────────────────────────────────────────────────────────

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  pink:   "\x1b[35m",
};

const c = (color, text) => `${C[color]}${text}${C.reset}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveVersion(pkgName) {
  // Try to find the installed version in the nearest node_modules
  const searchDirs = [];
  let dir = process.cwd();
  while (true) {
    searchDirs.push(path.join(dir, "node_modules", `@disckit`, pkgName, "package.json"));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  for (const candidate of searchDirs) {
    try {
      return JSON.parse(fs.readFileSync(candidate, "utf8")).version;
    } catch {}
  }
  return null;
}

function resolveMetaVersion() {
  const searchDirs = [];
  let dir = process.cwd();
  while (true) {
    searchDirs.push(path.join(dir, "node_modules", "disckit", "package.json"));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  for (const candidate of searchDirs) {
    try {
      return JSON.parse(fs.readFileSync(candidate, "utf8")).version;
    } catch {}
  }
  // Fallback: read own package.json
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")).version;
  } catch {}
  return "unknown";
}

function printBanner() {
  const ver = resolveMetaVersion();
  console.log();
  console.log(c("pink", c("bold", "  ⚡ disckit")) + c("dim", ` v${ver}`));
  console.log(c("dim", "  utilities for discord bots & dashboards"));
  console.log();
}

// ── Commands ──────────────────────────────────────────────────────────────────

function cmdList() {
  printBanner();
  console.log(c("bold", "  Packages\n"));

  let anyMissing = false;
  for (const pkg of PACKAGES) {
    const ver = resolveVersion(pkg.name);
    const verStr = ver
      ? c("green", `v${ver}`)
      : c("dim", "not installed");
    if (!ver) anyMissing = true;

    const nameStr = c("cyan", `@disckit/${pkg.name}`);
    console.log(`  ${nameStr.padEnd(42)} ${verStr}`);
    console.log(c("dim", `    ${pkg.desc}`));
    console.log();
  }

  if (anyMissing) {
    console.log(c("dim", "  Install missing packages:"));
    console.log(c("dim", "    npm install disckit\n"));
  }
}

function cmdInfo(pkgName) {
  printBanner();
  const pkg = PACKAGES.find(p => p.name === pkgName);
  if (!pkg) {
    console.log(c("red", `  Unknown package: ${pkgName}`));
    console.log(c("dim", `  Available: ${PACKAGES.map(p => p.name).join(", ")}\n`));
    process.exit(1);
  }

  const ver = resolveVersion(pkg.name);
  console.log(c("bold", `  @disckit/${pkg.name}`) + (ver ? c("dim", ` — v${ver}`) : ""));
  console.log(c("dim", `  ${pkg.desc}\n`));

  if (!ver) {
    console.log(c("yellow", "  ⚠  Not installed in this project."));
    console.log(c("dim", `  Run: npm install @disckit/${pkg.name}\n`));
  } else {
    console.log(c("green", "  ✔  Installed\n"));
  }

  console.log(c("dim", `  npm:    https://www.npmjs.com/package/@disckit/${pkg.name}`));
  console.log(c("dim", `  github: https://github.com/disckit/disckit/tree/main/${pkg.name}\n`));
}

function cmdHelp() {
  printBanner();
  console.log(c("bold", "  Usage\n"));
  console.log(`  ${c("cyan", "disckit list")}         List all @disckit packages and their installed versions`);
  console.log(`  ${c("cyan", "disckit info <pkg>")}   Show info about a specific package`);
  console.log(`  ${c("cyan", "disckit help")}         Show this help\n`);
  console.log(c("dim", "  Examples:"));
  console.log(c("dim", "    disckit list"));
  console.log(c("dim", "    disckit info paginator\n"));
}

// ── Entry point ───────────────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case "list":
  case "ls":
    cmdList();
    break;
  case "info":
    if (!args[0]) {
      console.error(c("red", "\n  Usage: disckit info <package>\n"));
      process.exit(1);
    }
    cmdInfo(args[0].replace("@disckit/", ""));
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    cmdHelp();
    break;
  default:
    console.error(c("red", `\n  Unknown command: ${cmd}`));
    cmdHelp();
    process.exit(1);
}
