/**
 * I18n — Core translation engine.
 * Handles locale loading, dot-notation key resolution, interpolation and pluralization.
 */
class I18n {
  constructor(options = {}) {
    this._fallback   = options.fallback ?? "en";
    this._missingTpl = options.missing  ?? "__MISSING__{{key}}__";
    this._locales    = new Map();
  }

  load(locale, messages) {
    if (!locale || typeof locale !== "string") throw new TypeError("locale must be a non-empty string");
    if (!messages || typeof messages !== "object") throw new TypeError("messages must be a plain object");
    this._locales.set(locale, this._merge(this._locales.get(locale) ?? {}, messages));
    return this;
  }

  t(key, locale, vars = {}) {
    const raw = this._resolve(key, locale) ?? this._resolve(key, this._fallback);
    if (raw === undefined) return this._interpolate(this._missingTpl, { key, ...vars });
    return this._interpolate(this._pluralize(raw, vars), vars);
  }

  has(key, locale) {
    return this._resolve(key, locale) !== undefined || this._resolve(key, this._fallback) !== undefined;
  }

  locales() { return [...this._locales.keys()]; }

  _resolve(key, locale) {
    const messages = this._locales.get(locale);
    if (!messages) return undefined;
    let node = messages;
    for (const part of key.split(".")) {
      if (node === null || typeof node !== "object" || !(part in node)) return undefined;
      node = node[part];
    }
    return node;
  }

  _pluralize(raw, vars) {
    if (typeof raw !== "object" || raw === null) return String(raw);
    const n = Number(vars.n ?? vars.count ?? 1);
    if (n === 0 && "zero" in raw) return raw.zero;
    if (n === 1 && "one"  in raw) return raw.one;
    return raw.other ?? raw.one ?? JSON.stringify(raw);
  }

  _interpolate(str, vars) {
    if (!vars || typeof str !== "string") return str;
    return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? String(vars[k]) : `{{${k}}}`));
  }

  _merge(target, source) {
    const out = { ...target };
    for (const [k, v] of Object.entries(source)) {
      out[k] = (v && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object")
        ? this._merge(out[k], v)
        : v;
    }
    return out;
  }
}

module.exports = { I18n };
