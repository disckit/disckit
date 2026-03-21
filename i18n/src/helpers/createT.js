/**
 * Creates a pre-bound translate function for a fixed locale.
 *
 * @param {import("../core/I18n").I18n} i18n
 * @param {string} locale
 * @returns {(key: string, vars?: object) => string}
 *
 * @example
 *   const t = createT(i18n, "pt");
 *   t("greet", { name: "Mundo" }); // → "Olá, Mundo!"
 */
function createT(i18n, locale) {
  return (key, vars) => i18n.t(key, locale, vars);
}

module.exports = { createT };
