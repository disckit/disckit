// @disckit/common — ESM entry point
// Re-exports all CJS exports as named ESM exports.
// Compatible with: import { formatTime } from "@disckit/common"

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const StringUtils         = pkg.StringUtils;
export const TimeUtils           = pkg.TimeUtils;
export const ArrayUtils          = pkg.ArrayUtils;
export const RandomUtils         = pkg.RandomUtils;
export const AsyncUtils          = pkg.AsyncUtils;
export const DISCORD             = pkg.DISCORD;
export const TIME                = pkg.TIME;
export const TIME_SECONDS        = pkg.TIME_SECONDS;
export const sleep               = pkg.sleep;
export const chunk               = pkg.chunk;
export const randomInt           = pkg.randomInt;
export const randomIntBetween    = pkg.randomIntBetween;
export const randomFrom          = pkg.randomFrom;
export const formatTime          = pkg.formatTime;
export const formatTimeShort     = pkg.formatTimeShort;
export const toDiscordTimestamp  = pkg.toDiscordTimestamp;
export const isSnowflake         = pkg.isSnowflake;
export const mentionUser         = pkg.mentionUser;
export const mentionRole         = pkg.mentionRole;
export const mentionChannel      = pkg.mentionChannel;
export const diffHours           = pkg.diffHours;
export const getRemainingTime    = pkg.getRemainingTime;
export const truncate            = pkg.truncate;
export const capitalize          = pkg.capitalize;
export const isHexColor          = pkg.isHexColor;
export const containsLink        = pkg.containsLink;
export const containsDiscordInvite = pkg.containsDiscordInvite;
export const isBlank             = pkg.isBlank;
export const escapeMarkdown      = pkg.escapeMarkdown;
export const codeBlock           = pkg.codeBlock;
export const inlineCode          = pkg.inlineCode;

export default pkg;
