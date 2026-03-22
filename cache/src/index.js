/**
 * enerthya.dev-cache
 * Real LRU + TTL cache. Zero external dependencies.
 *
 * @example
 * const { LRUCache, TTLCache, createCache } = require("enerthya.dev-cache");
 *
 * // Plain LRU — evicts oldest when full, no TTL
 * const lru = new LRUCache(100);
 * lru.set("key", "value");
 * lru.get("key"); // "value"
 *
 * // LRU + TTL — entries expire after 5 minutes by default
 * const cache = new TTLCache(100, 5 * 60 * 1000);
 * cache.set("key", "value");
 * cache.set("short", "data", 10_000); // 10 s override
 *
 * // Factory helper (replaces fixedsize-map drop-in usage)
 * const c = createCache(200);           // LRU only
 * const t = createCache(200, 60_000);   // LRU + TTL 1 min
 */

const { LRUCache } = require("./lru/LRUCache");
const { TTLCache } = require("./ttl/TTLCache");
const { DEFAULT_MAX_SIZE, DEFAULT_TTL_MS } = require("./constants/defaults");

/**
 * Factory for the most common use-case:
 *   - With ttlMs → returns TTLCache (LRU + expiration)
 *   - Without    → returns LRUCache (pure LRU)
 *
 * @param {number} [maxSize=500]
 * @param {number} [ttlMs=0]     0 = no expiration
 * @returns {LRUCache|TTLCache}
 */
function createCache(maxSize = DEFAULT_MAX_SIZE, ttlMs = DEFAULT_TTL_MS) {
    return ttlMs > 0
        ? new TTLCache(maxSize, ttlMs)
        : new LRUCache(maxSize);
}

module.exports = {
    LRUCache,
    TTLCache,
    createCache,
    DEFAULT_MAX_SIZE,
    DEFAULT_TTL_MS,
};
