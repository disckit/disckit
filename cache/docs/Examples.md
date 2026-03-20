# Examples — @disckit/cache

## Invite tracking cache

```js
const { TTLCache } = require('@disckit/cache');

const inviteCache = new TTLCache(500, 10 * 60 * 1000); // 10 min TTL per guild

client.on('guildMemberAdd', async member => {
  let cached = inviteCache.get(member.guild.id);
  if (!cached) {
    const fetched = await member.guild.invites.fetch();
    inviteCache.set(member.guild.id, fetched);
    cached = fetched;
  }
  // compare cached vs current to detect which invite was used
});
```

## Fixed-size LRU for parsed embeds

```js
const { LRUCache } = require('@disckit/cache');

const embedCache = new LRUCache(200);

function getEmbed(messageId) {
  if (embedCache.has(messageId)) return embedCache.get(messageId);
  const embed = parseEmbed(messageId);
  embedCache.set(messageId, embed);
  return embed;
}
```

## Periodic cleanup

```js
const { TTLCache } = require('@disckit/cache');

const cache = new TTLCache(1000, 60_000);

// Proactively purge expired entries every 5 minutes
setInterval(() => {
  const purged = cache.purgeExpired();
  if (purged > 0) logger.debug(`Purged ${purged} expired cache entries`);
}, 5 * 60_000);
```

## TypeScript with generics

```ts
import { LRUCache, TTLCache } from '@disckit/cache';

interface GuildSettings { prefix: string; lang: string; }

const settings = new LRUCache<string, GuildSettings>(500);
settings.set('123', { prefix: '!', lang: 'pt' });

const entry = settings.get('123');
// TypeScript knows entry is GuildSettings | undefined
```
