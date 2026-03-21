# ESM vs CommonJS

All `@disckit` packages support both module systems via a dual exports map.

## CommonJS (Node.js bots)

```js
const { formatTime, isSnowflake } = require('@disckit/common');
const { CooldownManager }  = require('@disckit/cooldown');
const { AntifloodManager } = require('@disckit/antiflood');
```

This is what `create-disckit-app` generates by default and what works in any Node.js bot using `module.exports`.

## ESM (import/export)

```js
import { formatTime, isSnowflake } from '@disckit/common';
import { CooldownManager }  from '@disckit/cooldown';
import { AntifloodManager } from '@disckit/antiflood';
```

ESM works in:
- Projects with `"type": "module"` in `package.json`
- TypeScript with `"module": "ESNext"` or `"NodeNext"`
- Vite, esbuild, Rollup and other bundlers
- Browser environments via CDN

## How the exports map works

Each package ships with this `exports` field:

```json
{
  "exports": {
    ".": {
      "import":  "./esm/index.js",
      "require": "./src/index.js",
      "default": "./src/index.js",
      "types":   "./types/index.d.ts"
    }
  }
}
```

Node.js and bundlers automatically pick the right file based on how you import.

::: tip
The `module` field (`"module": "esm/index.js"`) is also present for bundlers that don't yet support the `exports` map.
:::

## Which should I use?

| Use case | Recommendation |
|----------|---------------|
| Discord.js bot (classic) | CommonJS — just `require()` |
| Bot with `"type":"module"` | ESM — `import` |
| TypeScript bot | Either works — CJS is simpler |
| Vite dashboard | ESM — tree-shaking works best |
| Browser via CDN | ESM |
