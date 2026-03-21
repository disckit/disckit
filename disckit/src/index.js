/**
 * disckit — All @disckit packages in one install.
 *
 * Install everything:
 *   npm install disckit
 *
 * Or install individually:
 *   npm install @disckit/common
 *   npm install @disckit/antiflood
 *   npm install @disckit/caffeine
 *   npm install @disckit/cache
 *   npm install @disckit/placeholders
 *   npm install @disckit/paginator
 *   npm install @disckit/i18n
 *   npm install @disckit/permissions
 *   npm install @disckit/cooldown
 */

module.exports = {
  ...require("@disckit/common"),
  ...require("@disckit/paginator"),
  ...require("@disckit/i18n"),
  ...require("@disckit/permissions"),
  ...require("@disckit/cooldown"),
  ...require("@disckit/caffeine"),
  ...require("@disckit/cache"),
  ...require("@disckit/placeholders"),
};
