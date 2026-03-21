// Utility helpers for antiflood consumers.

/**
 * Format retryAfterMs into a human-readable string.
 * e.g. 1500 → "1s"  |  65000 → "1m 5s"  |  3661000 → "1h 1m 1s"
 *
 * @param {number} ms
 * @returns {string}
 */
function formatRetryAfter(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
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
