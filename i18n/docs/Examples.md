# Examples — @disckit/i18n

## Multi-language Discord bot

```js
const { I18n, createT } = require('@disckit/i18n');

const i18n = new I18n({ fallback: 'en' });

i18n.load('en', {
  commands: {
    ping:  { reply: 'Pong! Latency: {{ms}}ms' },
    ban:   { success: '{{user}} was banned.', missing_perm: 'You need BAN_MEMBERS.' },
    daily: { claimed: 'You claimed **{{coins}}** coins!', cooldown: 'Come back in {{time}}.' },
  },
  errors: { generic: 'Something went wrong. Try again later.' },
});

i18n.load('pt', {
  commands: {
    ping:  { reply: 'Pong! Latência: {{ms}}ms' },
    ban:   { success: '{{user}} foi banido.' },
    daily: { claimed: 'Você coletou **{{coins}}** fragmentos!', cooldown: 'Volte em {{time}}.' },
  },
});

// In a slash command:
const locale = interaction.locale?.startsWith('pt') ? 'pt' : 'en';
const t = createT(i18n, locale);

await interaction.reply(t('commands.ping.reply', { ms: client.ws.ping }));
```

## Loading from JSON files

```js
const path = require('path');
const fs   = require('fs');

const i18n = new I18n({ fallback: 'en' });
const localesDir = path.join(__dirname, 'locales');

fs.readdirSync(localesDir)
  .filter(f => f.endsWith('.json'))
  .forEach(f => {
    const locale = f.replace('.json', '');
    i18n.load(locale, require(path.join(localesDir, f)));
  });
```

## Pluralization

```js
i18n.load('en', {
  warn: {
    zero:  'No warnings',
    one:   '{{n}} warning',
    other: '{{n}} warnings',
  },
});

i18n.t('warn', 'en', { n: 0 });  // → "No warnings"
i18n.t('warn', 'en', { n: 1 });  // → "1 warning"
i18n.t('warn', 'en', { n: 5 });  // → "5 warnings"
```

## TypeScript

```ts
import { I18n, createT, TFunction, LocaleMessages } from '@disckit/i18n';

const messages: LocaleMessages = {
  hello: 'Hello, {{name}}!',
  items: { one: '{{n}} item', other: '{{n}} items' },
};

const i18n = new I18n({ fallback: 'en' });
i18n.load('en', messages);

const t: TFunction = createT(i18n, 'en');
t('hello', { name: 'World' }); // → "Hello, World!"
```
