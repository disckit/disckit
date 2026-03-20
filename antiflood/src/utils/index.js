// Utility helpers for antiflood consumers.

// formatTime is already implemented (and well-tested) in enerthya.dev-common.
// We import from there instead of reimplementing — per rule P16a.
const { formatTime } = require("@disckit/common");

/**
 * Format retryAfterMs into a human-readable Portuguese string.
 * Delegates to enerthya.dev-common's formatTime (seconds → PT-BR).
 * e.g. 1500 → "1 segundo"  |  65000 → "1 minuto, 5 segundos"
 *
 * @param {number} ms
 * @returns {string}
 */
function formatRetryAfter(ms) {
  return formatTime(Math.ceil(ms / 1000));
}

/**
 * Return true when the check result means the request should be blocked.
 * @param {{ result: string }} checkResult
 * @returns {boolean}
 */
function isBlocked(checkResult) {
  return checkResult.result === "THROTTLED" || checkResult.result === "PENALIZED";
}

module.exports = { formatRetryAfter, isBlocked };
