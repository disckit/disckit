# Examples — @disckit/caffeine

## Guild settings (most common use case)

```js
const { CacheBuilder } = require('@disckit/caffeine');
const Guild = require('./models/Guild');

const guildCache = CacheBuilder.newBuilder()
  .maximumSize(500)
  .expireAfterAccess(30 * 60 * 1000)  // evict after 30 min idle
  .refreshAfterWrite(5 * 60 * 1000)   // background refresh every 5 min
  .onEviction((key, _, reason) => logger.debug(`Guild ${key} evicted: ${reason}`))
  .buildAsync(async (guildId) => {
    let doc = await Guild.findById(guildId);
    if (!doc) doc = await new Guild({ _id: guildId }).save();
    return doc;
  });

// In getSettings:
const settings = await guildCache.get(guild.id);

// After dashboard saves config:
guildCache.invalidate(guildId);
```

## Monitoring cache performance

```js
setInterval(() => {
  const { hits, misses, loads, evictions, size } = guildCache.stats;
  const ratio = hits / (hits + misses) || 0;
  logger.info(`Cache: ${size} entries | hit ratio ${(ratio * 100).toFixed(1)}% | ${evictions} evictions`);
}, 60_000);
```

## No bound loader — per-call

```js
const apiCache = CacheBuilder.newBuilder()
  .maximumSize(100)
  .expireAfterWrite(30_000)
  .build();

const data = await apiCache.get('pokemon:pikachu', async (key) => {
  const [, name] = key.split(':');
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json());
});
```
