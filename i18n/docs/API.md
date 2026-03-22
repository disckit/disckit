# API Reference — @disckit/i18n

## `class I18n`

### Constructor

```ts
new I18n(options?: { fallback?: string; missing?: string })
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fallback` | `string` | `"en"` | Locale used when a key is not found in the requested locale |
| `missing` | `string` | `"__MISSING__{{key}}__"` | Template rendered for missing keys. `{{key}}` is replaced with the key name |

### `load(locale, messages)` → `this`

Deep-merges `messages` into the locale. Safe to call multiple times — subsequent calls merge, not replace.

Throws `TypeError` if `locale` is not a non-empty string or `messages` is not a plain object.

### `t(key, locale, vars?)` → `string`

Translates a dot-notation key for the given locale.

- Falls back to `options.fallback` if not found in `locale`
- Returns `options.missing` template if not found in either
- Applies `{{var}}` interpolation from `vars`
- Auto-selects plural form from `{ zero, one, other }` objects using `vars.n` or `vars.count`

### `has(key, locale)` → `boolean`

Returns `true` if the key exists in `locale` or the fallback locale.

### `locales()` → `string[]`

Returns all loaded locale names.

---

## `createT(i18n, locale)` → `TFunction`

Creates a pre-bound translate function for a fixed locale.

```ts
function createT(i18n: I18n, locale: string): (key: string, vars?: TranslateVars) => string
```

Useful in command handlers where the user's locale is known upfront.

---

## Pluralization shapes

```js
// Auto-selected by vars.n or vars.count
{ zero: "No items",    one: "{{n}} item",   other: "{{n}} items" }
{ one:  "{{n}} result", other: "{{n}} results" }
```

## Interpolation

Variables use `{{varName}}` syntax. Any key in `vars` is replaced:

```js
i18n.t('greet', 'en', { name: 'World', count: 5 })
// "Hello, World! You have 5 messages."
```
