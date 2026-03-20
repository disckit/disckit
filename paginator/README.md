<div align="center">
  <br />
  <p>
    <a href="https://github.com/disckit/disckit"><img src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg" width="546" alt="disckit" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@disckit/paginator"><img src="https://img.shields.io/npm/v/@disckit/paginator.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@disckit/paginator"><img src="https://img.shields.io/npm/dt/@disckit/paginator.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://www.npmjs.com/package/@disckit/paginator"><img src="https://img.shields.io/badge/TypeScript-types-blue" alt="TypeScript types" /></a>
    <a href="https://github.com/disckit/disckit/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license" /></a>
  </p>
</div>

## About

`@disckit/paginator` is a universal pagination engine for bots and dashboards.

Node.js 18.0.0 or newer is required.

## Installation

```sh
npm install @disckit/paginator
yarn add @disckit/paginator
pnpm add @disckit/paginator
```

## Examples

```js
const { paginate, Paginator, fromQuery } = require("@disckit/paginator");

// Slice any array
const result = paginate(items, { page: 2, limit: 10 });
result.items;       // → items 11–20
result.totalPages;  // → 5
result.hasPrev;     // → true
result.hasNext;     // → true

// Stateful — Discord buttons
const p = new Paginator({ total: 50, limit: 10 });
p.next();
p.buttons(); // → { prev: { disabled: false }, next: { disabled: false }, label: "Page 2 / 5" }
p.slice(allItems); // → items for current page

// REST API
const { skip, limit, meta } = fromQuery(req.query, { total: 200 });
```

See the [docs](./docs) folder for detailed usage.

## Links

- [npm](https://www.npmjs.com/package/@disckit/paginator)
- [GitHub](https://github.com/disckit/disckit/tree/main/packages/paginator)
- [disckit monorepo](https://github.com/disckit/disckit)
