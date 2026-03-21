/**
 * Formats a millisecond duration as a short human-readable string.
 *
 * @param {number} ms
 * @returns {string}
 *
 * @example
 *   formatMs(0)         // → "0s"
 *   formatMs(500)       // → "500ms"
 *   formatMs(2500)      // → "2.5s"
 *   formatMs(90_000)    // → "2m"
 *   formatMs(3_600_000) // → "1h"
 */
function formatMs(ms) {
  if (ms <= 0)        return "0s";
  if (ms < 1000)      return `${ms}ms`;
  if (ms < 60_000)    return `${(ms / 1000).toFixed(1).replace(/\.0$/, "")}s`;
  if (ms < 3_600_000) return `${Math.ceil(ms / 60_000)}m`;
  return `${Math.ceil(ms / 3_600_000)}h`;
}

module.exports = { formatMs };
