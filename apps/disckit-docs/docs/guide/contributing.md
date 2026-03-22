# Contributing

Contributions are welcome! This is an open-source monorepo under the MIT license.

## Repository structure

```
disckit/
├── common/           ← @disckit/common
├── antiflood/        ← @disckit/antiflood
├── caffeine/         ← @disckit/caffeine
├── cache/            ← @disckit/cache
├── placeholders/     ← @disckit/placeholders
├── paginator/        ← @disckit/paginator
├── i18n/             ← @disckit/i18n
├── permissions/      ← @disckit/permissions
├── cooldown/         ← @disckit/cooldown
├── disckit/          ← meta-package + CLI
└── apps/
    ├── create-disckit-app/   ← scaffolding CLI
    └── disckit-docs/         ← this site
```

Each package follows this structure:

```
<package>/
├── src/          ← CJS source (main logic)
├── esm/          ← ESM wrapper (auto-generated)
├── types/        ← TypeScript declarations
├── tests/        ← node:test tests
├── docs/         ← API.md + Examples.md
├── README.md
├── LICENSE
└── package.json
```

## Running tests

Each package uses Node.js native `node:test` — no external test runner:

```sh
cd common
node --test tests/run.js
```

All tests must pass with **0 failures** before any publish.

## Adding a new package

1. Create `<name>/` following the structure above
2. Add it to `ALL_PACKAGES` in `GitHub/publish-all.sh`
3. Add it to the sidebar in `apps/disckit-docs/docs/.vitepress/config.ts`
4. Write docs in `apps/disckit-docs/docs/packages/<name>.md`
5. Open a PR

## Publishing

Maintainers publish from the **dashboard root**:

```sh
bash GitHub/publish-all.sh --message "feat: ..." --tag "vX.Y.Z"
```

The script lives at `dashboard/GitHub/publish-all.sh` — run it from the same folder that contains `GitHub/`, `packages/`, `server/`, etc.
