# disckit-docs

Documentation site for the [@disckit](https://github.com/disckit/disckit) packages.

Static single-page app — zero framework, zero build step.

## Deploy to Vercel

1. Push this folder (or the whole monorepo) to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `packages/GitHub/apps/disckit-docs`
4. Leave all build settings empty (static site, no build command needed)
5. Deploy

Or via CLI:
```sh
npm i -g vercel
cd packages/GitHub/apps/disckit-docs
vercel --prod
```

## Structure

```
disckit-docs/
  index.html   ← entire site (SPA with vanilla JS router)
  vercel.json  ← URL rewrite for client-side routing
  README.md
```

All pages are rendered client-side from `index.html` — adding a new page is just adding a new entry to the `PAGES` object in the script tag.
