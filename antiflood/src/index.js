// enerthya.dev-antiflood
// Advanced per-user+command+guild rate limiter with burst window,
// progressive penalty (additive or exponential) and role whitelist.
// Zero dependencies. Node.js only.

const { AntifloodManager } = require("./core/AntifloodManager");
const { BucketStore } = require("./core/BucketStore");
const { createRule } = require("./core/AntifloodRule");
const { FLOOD_RESULT, PENALTY_MODE, DEFAULT_RULE } = require("./constants");
const { formatRetryAfter, isBlocked } = require("./utils");

module.exports = {
  // Main class
  AntifloodManager,

  // Building blocks (for advanced usage / testing)
  BucketStore,
  createRule,

  // Constants
  FLOOD_RESULT,
  PENALTY_MODE,
  DEFAULT_RULE,

  // Utilities
  formatRetryAfter,
  isBlocked,
};
