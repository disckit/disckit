/**
 * @disckit/placeholders — Placeholder substitution engine for Discord bots.
 *
 * Zero Discord.js dependency — works in bots, REST APIs and dashboards.
 *
 * @example
 * const { applyPlaceholders, buildPreviewContext } = require("@disckit/placeholders");
 *
 * const ctx = buildPreviewContext({ guildName: "My Server", memberName: "john" });
 * applyPlaceholders("Welcome {member:mention} to {server}!", ctx);
 * // → "Welcome <@000000000000000001> to My Server!"
 */

const {
  applyPlaceholders,
  detectPlaceholders,
  hasPlaceholders,
  buildPreviewContext,
} = require("./engine/PlaceholderEngine");

const {
  applyPresencePlaceholders,
  buildPresenceContext,
  buildShardedResolver,
} = require("./engine/PresenceEngine");

const {
  VARIABLES,
  getByGroup,
  getAllKeys,
  findByKey,
} = require("./constants/variables");

module.exports = {
  // ── Core ──────────────────────────────────────────────────────────────────
  applyPlaceholders,
  detectPlaceholders,
  hasPlaceholders,
  buildPreviewContext,

  // ── Presence ──────────────────────────────────────────────────────────────
  applyPresencePlaceholders,
  buildPresenceContext,
  buildShardedResolver,

  // ── Variable registry ─────────────────────────────────────────────────────
  VARIABLES,
  getByGroup,
  getAllKeys,
  findByKey,
};
