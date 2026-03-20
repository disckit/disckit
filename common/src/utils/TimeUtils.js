/**
 * TimeUtils — Time and duration helper functions for Enerthya.
 * Equivalent to time utilities from Loritta's `common` module.
 */

/**
 * Format a duration in seconds into a human-readable string (PT-BR).
 * Example: 3661 → "1 hora, 1 minuto, 1 segundo"
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTime(totalSeconds) {
  const days = Math.floor((totalSeconds % 31536000) / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days} dia${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hora${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0) parts.push(`${seconds} segundo${seconds !== 1 ? "s" : ""}`);

  return parts.join(", ") || "0 segundos";
}

/**
 * Format a duration in seconds into a short string.
 * Example: 3661 → "1h 1m 1s"
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTimeShort(totalSeconds) {
  const days = Math.floor((totalSeconds % 31536000) / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
}

/**
 * Convert a "HH:MM:SS" duration string to milliseconds.
 * @param {string} duration - e.g. "1:30:00"
 * @returns {number}
 */
function durationToMillis(duration) {
  return (
    duration
      .split(":")
      .map(Number)
      .reduce((acc, curr) => curr + acc * 60) * 1000
  );
}

/**
 * Get the remaining time from now until a future Date.
 * @param {Date} futureDate
 * @returns {string} - Human-readable string via formatTime
 */
function getRemainingTime(futureDate) {
  const seconds = Math.max(0, (futureDate - new Date()) / 1000);
  return formatTime(seconds);
}

/**
 * Get the hour difference between two Date objects.
 * @param {Date} dt1
 * @param {Date} dt2
 * @returns {number}
 */
function diffHours(dt1, dt2) {
  const diff = Math.abs(dt2.getTime() - dt1.getTime()) / 1000 / 3600;
  return Math.round(diff);
}

/**
 * Format an uptime in milliseconds into a readable string.
 * @param {number} ms
 * @returns {string}
 */
function formatUptime(ms) {
  return formatTime(Math.floor(ms / 1000));
}

/**
 * Convert milliseconds to seconds.
 * @param {number} ms
 * @returns {number}
 */
function msToSeconds(ms) {
  return Math.floor(ms / 1000);
}

/**
 * Convert seconds to milliseconds.
 * @param {number} s
 * @returns {number}
 */
function secondsToMs(s) {
  return s * 1000;
}

module.exports = {
  formatTime,
  formatTimeShort,
  durationToMillis,
  getRemainingTime,
  diffHours,
  formatUptime,
  msToSeconds,
  secondsToMs,
};
