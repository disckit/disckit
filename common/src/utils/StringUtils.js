/**
 * StringUtils — String helper functions for Enerthya.
 * Equivalent to string utilities from Loritta's `common` module.
 */

const DISCORD_INVITE_REGEX =
  /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|link|plus)|discordapp?\.com\/invite|invite\.gg|dsc\.gg)\/?[^\s/]+?(?=\b)/;

const URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Check if a string contains a URL.
 * @param {string} text
 * @returns {boolean}
 */
function containsLink(text) {
  if (typeof text !== "string") return false;
  return URL_REGEX.test(text);
}

/**
 * Check if a string contains a Discord invite.
 * @param {string} text
 * @returns {boolean}
 */
function containsDiscordInvite(text) {
  if (typeof text !== "string") return false;
  return DISCORD_INVITE_REGEX.test(text);
}

/**
 * Check if a string is a valid hex color (#RRGGBB).
 * @param {string} text
 * @returns {boolean}
 */
function isHexColor(text) {
  if (typeof text !== "string") return false;
  return HEX_COLOR_REGEX.test(text);
}

/**
 * Truncate a string to a max length, appending an ellipsis if needed.
 * @param {string} text
 * @param {number} maxLength
 * @param {string} [suffix="..."]
 * @returns {string}
 */
function truncate(text, maxLength, suffix = "...") {
  if (typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize the first letter of a string.
 * @param {string} text
 * @returns {string}
 */
function capitalize(text) {
  if (typeof text !== "string" || text.length === 0) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Remove leading and trailing whitespace and collapse internal spaces.
 * @param {string} text
 * @returns {string}
 */
function normalizeSpaces(text) {
  if (typeof text !== "string") return "";
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Check if a string is blank (empty or only whitespace).
 * @param {string} text
 * @returns {boolean}
 */
function isBlank(text) {
  if (typeof text !== "string") return true;
  return text.trim().length === 0;
}

/**
 * Escape Discord markdown characters in a string.
 * @param {string} text
 * @returns {string}
 */
function escapeMarkdown(text) {
  if (typeof text !== "string") return "";
  return text.replace(/([*_`~|\\])/g, "\\$1");
}

/**
 * Wrap a string in a Discord code block.
 * @param {string} text
 * @param {string} [lang=""] - Optional language for syntax highlighting
 * @returns {string}
 */
function codeBlock(text, lang = "") {
  return `\`\`\`${lang}\n${text}\n\`\`\``;
}

/**
 * Wrap a string in a Discord inline code span.
 * @param {string} text
 * @returns {string}
 */
function inlineCode(text) {
  return `\`${text}\``;
}

module.exports = {
  containsLink,
  containsDiscordInvite,
  isHexColor,
  truncate,
  capitalize,
  normalizeSpaces,
  isBlank,
  escapeMarkdown,
  codeBlock,
  inlineCode,
};
