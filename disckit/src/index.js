/**
 * disckit — All @disckit packages in one install.
 *
 * Install everything:
 *   npm install disckit
 *
 * Or install individually:
 *   npm install @disckit/paginator
 *   npm install @disckit/i18n
 *   npm install @disckit/permissions
 *   npm install @disckit/cooldown
 */

module.exports = {
  ...require("@disckit/paginator"),
  ...require("@disckit/i18n"),
  ...require("@disckit/permissions"),
  ...require("@disckit/cooldown"),
};
