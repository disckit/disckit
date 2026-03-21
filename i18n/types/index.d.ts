// Supports both CJS and ESM:
//   const { X } = require("@disckit/i18n");   // CommonJS
//   import { X } from "@disckit/i18n";         // ESM (Node >=18, bundlers)
//
// @disckit/i18n — TypeScript definitions

export type LocaleMessages = {
  [key: string]: string | LocaleMessages | PluralMessages;
};

export interface PluralMessages {
  zero?: string;
  one?: string;
  other: string;
}

export interface I18nOptions {
  /** Fallback locale when a key is not found in the requested locale. Default: "en". */
  fallback?: string;
  /** Template for missing keys. Use {{key}} as placeholder. Default: "__MISSING__{{key}}__". */
  missing?: string;
}

export type TranslateVars = Record<string, string | number>;

/** Pre-bound translate function for a fixed locale. */
export type TFunction = (key: string, vars?: TranslateVars) => string;

/**
 * Core i18n engine with dot-notation keys, interpolation, pluralization and fallback locale.
 *
 * @example
 * const i18n = new I18n({ fallback: "en" });
 * i18n.load("en", { greet: "Hello, {{name}}!" });
 * i18n.load("pt", { greet: "Olá, {{name}}!" });
 * i18n.t("greet", "pt", { name: "Mundo" }); // → "Olá, Mundo!"
 */
export class I18n {
  constructor(options?: I18nOptions);

  /**
   * Load (or merge) messages for a locale.
   * Can be called multiple times — messages are deep-merged.
   */
  load(locale: string, messages: LocaleMessages): this;

  /**
   * Translate a key for a locale.
   * Falls back to the fallback locale if the key is not found.
   * Supports interpolation with {{var}} and pluralization via { zero, one, other }.
   */
  t(key: string, locale: string, vars?: TranslateVars): string;

  /** Returns true if the key exists in the given locale or the fallback locale. */
  has(key: string, locale: string): boolean;

  /** Returns all loaded locale names. */
  locales(): string[];
}

/**
 * Creates a pre-bound translate function for a fixed locale.
 *
 * @example
 * const t = createT(i18n, "pt");
 * t("greet", { name: "Mundo" }); // → "Olá, Mundo!"
 */
export function createT(i18n: I18n, locale: string): TFunction;
