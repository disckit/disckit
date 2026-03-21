import { defineConfig } from 'vitepress'

export default defineConfig({
  lang:        'en-US',
  title:       'disckit',
  description: 'Utilities for Discord bots & dashboards.',

  head: [
    ['link', { rel: 'icon', href: 'https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#ff468a' }],
    ['meta', { property: 'og:title', content: 'disckit' }],
    ['meta', { property: 'og:description', content: 'Utilities for Discord bots & dashboards.' }],
    ['meta', { property: 'og:image', content: 'https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg' }],
  ],

  themeConfig: {
    logo: 'https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg',
    siteTitle: 'disckit',

    // ── Top nav ───────────────────────────────────────────────────────────────
    nav: [
      { text: 'Guide',    link: '/guide/introduction' },
      { text: 'Packages', link: '/packages/common' },
      {
        text: 'v2.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/disckit/disckit/releases' },
          { text: 'npm',       link: 'https://www.npmjs.com/package/disckit' },
        ],
      },
    ],

    // ── Sidebar ───────────────────────────────────────────────────────────────
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction',  link: '/guide/introduction' },
            { text: 'Installation',  link: '/guide/installation' },
            { text: 'Quick Start',   link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Going Further',
          items: [
            { text: 'TypeScript',    link: '/guide/typescript' },
            { text: 'ESM vs CJS',    link: '/guide/esm-cjs' },
            { text: 'Contributing',  link: '/guide/contributing' },
          ],
        },
      ],
      '/packages/': [
        {
          text: 'Foundation',
          items: [
            { text: '@disckit/common',       link: '/packages/common' },
          ],
        },
        {
          text: 'Bot Utilities',
          items: [
            { text: '@disckit/antiflood',    link: '/packages/antiflood' },
            { text: '@disckit/cooldown',     link: '/packages/cooldown' },
            { text: '@disckit/paginator',    link: '/packages/paginator' },
            { text: '@disckit/placeholders', link: '/packages/placeholders' },
            { text: '@disckit/permissions',  link: '/packages/permissions' },
            { text: '@disckit/i18n',         link: '/packages/i18n' },
          ],
        },
        {
          text: 'Caching',
          items: [
            { text: '@disckit/cache',        link: '/packages/cache' },
            { text: '@disckit/caffeine',     link: '/packages/caffeine' },
          ],
        },
      ],
    },

    // ── Social ────────────────────────────────────────────────────────────────
    socialLinks: [
      { icon: 'github', link: 'https://github.com/disckit/disckit' },
      { icon: 'npm',    link: 'https://www.npmjs.com/package/disckit' },
    ],

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025–present disckit contributors',
    },

    // ── Search ────────────────────────────────────────────────────────────────
    search: {
      provider: 'local',
    },

    // ── Edit link ─────────────────────────────────────────────────────────────
    editLink: {
      pattern: 'https://github.com/disckit/disckit/edit/main/apps/disckit-docs/docs/:path',
      text: 'Edit this page on GitHub',
    },

    // ── Last updated ──────────────────────────────────────────────────────────
    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'short' },
    },

    // ── Doc footer nav ────────────────────────────────────────────────────────
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },
  },

  // ── Markdown ─────────────────────────────────────────────────────────────────
  markdown: {
    theme: {
      light: 'github-light',
      dark:  'one-dark-pro',
    },
    lineNumbers: true,
  },

  // ── Build ─────────────────────────────────────────────────────────────────────
  cleanUrls: true,
})
