// AntifloodRule — merges user-supplied config with defaults and validates it.

const { DEFAULT_RULE, PENALTY_MODE } = require("../constants");

/**
 * Build a validated rule object from user-supplied partial config.
 * All fields are optional — defaults are applied for missing ones.
 *
 * @param {object} [config]
 * @param {number} [config.windowMs]
 * @param {number} [config.maxHits]
 * @param {string} [config.penaltyMode]
 * @param {number} [config.penaltyStep]
 * @param {number} [config.maxPenalty]
 * @returns {{ windowMs: number, maxHits: number, penaltyMode: string, penaltyStep: number, maxPenalty: number }}
 */
function createRule(config = {}) {
  const rule = Object.assign({}, DEFAULT_RULE, config);

  if (typeof rule.windowMs !== "number" || rule.windowMs <= 0) {
    throw new Error(`[antiflood] windowMs must be a positive number, got: ${rule.windowMs}`);
  }
  if (typeof rule.maxHits !== "number" || rule.maxHits < 1) {
    throw new Error(`[antiflood] maxHits must be >= 1, got: ${rule.maxHits}`);
  }
  if (!Object.values(PENALTY_MODE).includes(rule.penaltyMode)) {
    throw new Error(`[antiflood] penaltyMode must be one of ${Object.values(PENALTY_MODE).join(", ")}, got: ${rule.penaltyMode}`);
  }
  if (typeof rule.penaltyStep !== "number" || rule.penaltyStep < 0) {
    throw new Error(`[antiflood] penaltyStep must be >= 0, got: ${rule.penaltyStep}`);
  }
  if (typeof rule.maxPenalty !== "number" || rule.maxPenalty < 0) {
    throw new Error(`[antiflood] maxPenalty must be >= 0, got: ${rule.maxPenalty}`);
  }

  return Object.freeze(rule);
}

module.exports = { createRule };
