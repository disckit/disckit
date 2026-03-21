# @disckit/i18n — Documentation

## new I18n(options?)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fallback` | `string` | `"en"` | Locale used when a key is missing |
| `missing` | `string` | `"__MISSING__{{key}}__"` | Returned when key not found anywhere |

---

## i18n.load(locale, messages)

Merges translations into an existing locale. Safe to call multiple times.

```js
i18n.load("en", { greet: "Hello, {{name}}!" });
i18n.load("en", { bye: "Goodbye!" }); // both keys exist now
```

---

## i18n.t(key, locale, vars?)

Translates using dot-notation. Falls back to `fallback` locale if missing.

### Interpolation

```js
i18n.t("greet", "en", { name: "World" }); // → "Hello, World!"
```

### Pluralization

```js
i18n.load("en", { items: { zero: "No items", one: "{{n}} item", other: "{{n}} items" } });
i18n.t("items", "en", { n: 0 }); // → "No items"
i18n.t("items", "en", { n: 1 }); // → "1 item"
i18n.t("items", "en", { n: 5 }); // → "5 items"
```

---

## createT(i18n, locale)

Returns `(key, vars?) => string` pre-bound to a locale.

```js
const t = createT(i18n, "pt");
t("greet", { name: "Mundo" }); // → "Olá, Mundo!"
```
