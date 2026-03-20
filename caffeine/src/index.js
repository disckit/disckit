/**
 * enerthya.dev-caffeine
 *
 * Caffeine-inspired async cache builder for Node.js.
 * Inspired by: https://github.com/ben-manes/caffeine (Java/Kotlin)
 * Used by: Loritta Discord bot (Kotlin/JVM stack)
 *
 * Features:
 *   - Builder pattern       — CacheBuilder.newBuilder()...build()
 *   - expireAfterWrite(ms)  — expire N ms after last write
 *   - expireAfterAccess(ms) — expire N ms after last READ (idle timeout)
 *   - refreshAfterWrite(ms) — return stale + reload in background
 *   - buildAsync(loader)    — bound loader, no per-call boilerplate
 *   - onEviction(fn)        — callback on every eviction
 *   - Request coalescing    — concurrent get() for same key → 1 loader call
 *   - stats                 — hits, misses, loads, errors, coalesced, evictions, refreshes
 *   - Zero dependencies
 *
 * @example — Guild settings (most common usage in bot schemas)
 *
 * const guildCache = CacheBuilder.newBuilder()
 *   .maximumSize(500)
 *   .expireAfterAccess(30 * 60 * 1000)   // evict guilds idle for 30min
 *   .refreshAfterWrite(5 * 60 * 1000)    // background refresh every 5min
 *   .buildAsync(async (guildId) => {
 *     let doc = await GuildModel.findById(guildId);
 *     if (!doc) doc = await new GuildModel({ _id: guildId }).save();
 *     return doc;
 *   });
 *
 * // In getSettings:
 * const settings = await guildCache.get(guild.id);
 *
 * // After a PATCH saves to DB:
 * guildCache.invalidate(guild.id);
 *
 * @example — Member stats (simple expire after write)
 *
 * const memberCache = CacheBuilder.newBuilder()
 *   .maximumSize(1000)
 *   .expireAfterWrite(10 * 60 * 1000)
 *   .buildAsync(async (key) => {
 *     const [guildId, memberId] = key.split("|");
 *     let doc = await MemberModel.findOne({ guild_id: guildId, member_id: memberId });
 *     if (!doc) doc = new MemberModel({ guild_id: guildId, member_id: memberId });
 *     return doc;
 *   });
 *
 * const member = await memberCache.get(`${guildId}|${memberId}`);
 *
 * @example — No bound loader (per-call loader)
 *
 * const cache = CacheBuilder.newBuilder().maximumSize(100).build();
 * const value = await cache.get("key", async (k) => fetchFromAPI(k));
 *
 * @example — onEviction logging
 *
 * CacheBuilder.newBuilder()
 *   .maximumSize(500)
 *   .expireAfterAccess(60_000)
 *   .onEviction((key, value, reason) => {
 *     logger.debug(`cache evicted: ${key} (${reason})`);
 *   })
 *   .buildAsync(loader);
 */

const { CacheBuilder } = require("./core/CacheBuilder");
const { CaffeineCache } = require("./core/CaffeineCache");
const {
  DEFAULT_MAX_SIZE,
  DEFAULT_EXPIRE_AFTER_WRITE,
  DEFAULT_EXPIRE_AFTER_ACCESS,
  DEFAULT_REFRESH_AFTER_WRITE,
} = require("./constants/defaults");

module.exports = {
  CacheBuilder,
  CaffeineCache,
  DEFAULT_MAX_SIZE,
  DEFAULT_EXPIRE_AFTER_WRITE,
  DEFAULT_EXPIRE_AFTER_ACCESS,
  DEFAULT_REFRESH_AFTER_WRITE,
};
