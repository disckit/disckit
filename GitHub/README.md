# GitHub — nullbit publish scripts

Scripts to publish all `@disckit` packages to the GitHub monorepo and to npm.

Monorepo → [`github.com/disckit/disckit`](https://github.com/disckit/disckit)

```
packages/GitHub/
  disckit/          ← meta-package  →  npm install disckit
  paginator/        ← @disckit/paginator
  i18n/             ← @disckit/i18n
  permissions/      ← @disckit/permissions
  cooldown/         ← @disckit/cooldown
```

Each package follows the same structure:

```
<package>/
  src/
    core/             ← main classes
    util/             ← helpers and internal utilities
    index.js          ← re-exports everything
  tests/
    run.js            ← node tests/run.js → 0 failures before any publish
  docs/
    README.md         ← full API reference
  README.md           ← package overview (shown on GitHub and npm)
  package.json
  LICENSE
```

---

## One-time setup

### 1. Create the GitHub Organization

1. Go to: [https://github.com/organizations/plan](https://github.com/organizations/plan)
2. Choose **Free** — name: `disckit`
3. Done — the script creates the `disckit` repo automatically on first run

### 2. Create the npm Organization

1. Go to: [https://www.npmjs.com/org/create](https://www.npmjs.com/org/create)
2. Scope: `disckit` — Choose **Free**

### 3. Add tokens to `.env`

```env
GITHUB_TOKEN=ghp_your_token_here
NPM_TOKEN_GITHUB=npm_your_scoped_token_here
NPM_TOKEN_UNSCOPED=npm_your_unscoped_token_here
```

- **GITHUB_TOKEN** → [github.com/settings/tokens](https://github.com/settings/tokens) — scopes: `repo`, `read:org`, `delete_repo`
- **NPM_TOKEN_GITHUB** → [npmjs.com/settings/~/tokens](https://www.npmjs.com/settings/~/tokens) — type: **Automation** — used for `@disckit/*` scoped packages
- **NPM_TOKEN_UNSCOPED** → same page — type: **Automation** — used for `disckit` (unscoped meta-package)

---

## Publishing

```bash
bash GitHub/publish-all.sh               # all packages
bash GitHub/publish-all.sh cooldown      # one package
bash GitHub/publish-all.sh i18n cooldown # two packages
```

Bump `"version"` in `packages/GitHub/<n>/package.json` then run again.

---

## Delete old repos (before first publish)

```bash
bash GitHub/delete-repos.sh yes
```

---

## Packages

| Package | npm | Description |
|---------|-----|-------------|
| `disckit` | [disckit](https://www.npmjs.com/package/disckit) | Meta-package — installs everything |
| `paginator` | [@disckit/paginator](https://www.npmjs.com/package/@disckit/paginator) | Universal pagination for bots and dashboards |
| `i18n` | [@disckit/i18n](https://www.npmjs.com/package/@disckit/i18n) | Lightweight i18n with interpolation and pluralization |
| `permissions` | [@disckit/permissions](https://www.npmjs.com/package/@disckit/permissions) | Human-readable Discord permission bitfields |
| `cooldown` | [@disckit/cooldown](https://www.npmjs.com/package/@disckit/cooldown) | Per-user, per-command cooldown manager |

---

## Rules

### Monorepo structure

The monorepo is **flat** — packages live at the root, no `packages/` wrapper (same as discord.js):

```
disckit/disckit  ← repo root
  disckit/       ← meta-package (npm: disckit)
  paginator/
  i18n/
  permissions/
  cooldown/
  README.md
  LICENSE
```

### Tags

- **One tag per package** — short form only: `paginator@1.0.0`
- **Never** create scoped tags (`@disckit/paginator@1.0.0`) — they create duplicates on GitHub
- Before any publish, delete stale tags: `bash GitHub/delete-duplicate-tags.sh`
- Then publish with message and tag: `bash GitHub/publish-all.sh --message "..." --tag "vX.Y.Z"`

### npm token

- Token must be type **Automation** (not Classic) — wrong type causes `403 Forbidden`
- Always search npm before creating a package name — check `site:npmjs.com/package/<name>`
- The `@disckit/` scope is reserved for sub-packages — never use it on the meta-package (`disckit`)

### LICENSE

- Each package has its own `LICENSE` file
- There is also a root `LICENSE` next to the monorepo `README.md`
