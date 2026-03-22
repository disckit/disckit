/**
 * TTLCache — wraps LRUCache with per-entry expiration.
 * Expired entries are lazily evicted on access.
 * Zero external dependencies.
 *
 * @template K, V
 */

const { LRUCache } = require("../lru/LRUCache");

class TTLCache {
    /**
     * @param {number} maxSize    Maximum number of live entries.
     * @param {number} ttlMs      Default TTL in milliseconds. 0 = no expiration.
     */
    constructor(maxSize, ttlMs = 0) {
        if (!Number.isInteger(maxSize) || maxSize < 1) {
            throw new TypeError("TTLCache: maxSize must be a positive integer");
        }
        if (typeof ttlMs !== "number" || ttlMs < 0) {
            throw new TypeError("TTLCache: ttlMs must be a non-negative number");
        }

        this._lru = new LRUCache(maxSize);
        this._ttlMs = ttlMs;

        /** @type {number} */
        this.maxSize = maxSize;
    }

    /**
     * Returns the current number of entries (including not-yet-evicted expired ones).
     *
     * @returns {number}
     */
    get size() {
        return this._lru.size;
    }

    /**
     * Gets a value. Returns undefined if not found or expired.
     *
     * @param {K} key
     * @returns {V|undefined}
     */
    get(key) {
        const entry = this._lru.peek(key);
        if (entry === undefined) return undefined;

        if (this._isExpired(entry)) {
            this._lru.delete(key);
            return undefined;
        }

        this._lru.get(key); // promote to MRU
        return entry.value;
    }

    /**
     * Returns true if the key exists and is not expired.
     *
     * @param {K} key
     * @returns {boolean}
     */
    has(key) {
        const entry = this._lru.peek(key);
        if (entry === undefined) return false;

        if (this._isExpired(entry)) {
            this._lru.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Sets a value with an optional per-entry TTL override.
     *
     * @param {K}       key
     * @param {V}       value
     * @param {number}  [ttlMs]  Override default TTL for this entry. 0 = no expiration.
     */
    set(key, value, ttlMs) {
        const effectiveTtl = (typeof ttlMs === "number" && ttlMs >= 0) ? ttlMs : this._ttlMs;
        const expiresAt = effectiveTtl > 0 ? Date.now() + effectiveTtl : 0;

        this._lru.set(key, { value, expiresAt });
    }

    /**
     * Returns the cached value for `key`. If missing or expired, calls `fn()`
     * to produce the value, stores it, and returns it. Supports async loaders.
     *
     * @param {K}                    key
     * @param {() => V | Promise<V>} fn      Loader called on cache miss.
     * @param {number}               [ttlMs] Per-entry TTL override.
     * @returns {V | Promise<V>}
     *
     * @example
     * // Sync loader
     * const user = cache.getOrSet(`user:${id}`, () => db.findUser(id), 60_000);
     *
     * // Async loader
     * const config = await cache.getOrSet(`guild:${id}`, () => fetchConfig(id));
     */
    getOrSet(key, fn, ttlMs) {
        const cached = this.get(key);
        if (cached !== undefined) return cached;

        const result = fn();

        if (result && typeof result.then === "function") {
            return result.then(value => {
                this.set(key, value, ttlMs);
                return value;
            });
        }

        this.set(key, result, ttlMs);
        return result;
    }

    /**
     * Deletes a key. Returns true if it existed.
     *
     * @param {K} key
     * @returns {boolean}
     */
    delete(key) {
        return this._lru.delete(key);
    }

    /**
     * Removes all entries.
     */
    clear() {
        this._lru.clear();
    }

    /**
     * Removes all expired entries proactively.
     * Useful to call periodically if you want exact memory bounds.
     *
     * @returns {number} Number of entries evicted.
     */
    purgeExpired() {
        let count = 0;
        for (const [key, entry] of this._lru.entries()) {
            if (this._isExpired(entry)) {
                this._lru.delete(key);
                count++;
            }
        }
        return count;
    }

    /**
     * Returns all live [key, value] pairs (expired entries are skipped and evicted).
     *
     * @returns {Array<[K, V]>}
     */
    entries() {
        const result = [];
        const toDelete = [];

        for (const [key, entry] of this._lru.entries()) {
            if (this._isExpired(entry)) {
                toDelete.push(key);
            } else {
                result.push([key, entry.value]);
            }
        }

        for (const key of toDelete) this._lru.delete(key);
        return result;
    }

    /**
     * Returns all live keys.
     *
     * @returns {K[]}
     */
    keys() {
        return this.entries().map(([k]) => k);
    }

    // ── Private ────────────────────────────────────────────────────────────────

    _isExpired(entry) {
        return entry.expiresAt > 0 && Date.now() > entry.expiresAt;
    }
}

module.exports = { TTLCache };
