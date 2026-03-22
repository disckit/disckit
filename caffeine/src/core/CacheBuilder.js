/**
 * CacheBuilder — fluent builder for CaffeineCache.
 *
 * Mirrors the Java Caffeine API:
 *   Caffeine.newBuilder()
 *     .maximumSize(500)
 *     .expireAfterWrite(TimeUnit.MINUTES, 5)
 *     .build(loader)
 *
 * JavaScript version:
 *   CacheBuilder.newBuilder()
 *     .maximumSize(500)
 *     .expireAfterWrite(5 * 60 * 1000)
 *     .buildAsync(async (key) => ...)
 */

const { CaffeineCache } = require("./CaffeineCache");
const {
  DEFAULT_MAX_SIZE,
  DEFAULT_EXPIRE_AFTER_WRITE,
  DEFAULT_EXPIRE_AFTER_ACCESS,
  DEFAULT_REFRESH_AFTER_WRITE,
} = require("../constants/defaults");

class CacheBuilder {
  constructor() {
    this._maximumSize = DEFAULT_MAX_SIZE;
    this._expireAfterWrite = DEFAULT_EXPIRE_AFTER_WRITE;
    this._expireAfterAccess = DEFAULT_EXPIRE_AFTER_ACCESS;
    this._refreshAfterWrite = DEFAULT_REFRESH_AFTER_WRITE;
    this._onEviction = null;
  }

  /**
   * Entry point — mirrors Caffeine.newBuilder().
   * @returns {CacheBuilder}
   */
  static newBuilder() {
    return new CacheBuilder();
  }

  /**
   * Maximum number of entries. LRU eviction when full.
   * @param {number} size
   * @returns {CacheBuilder}
   */
  maximumSize(size) {
    if (!Number.isInteger(size) || size < 1) throw new TypeError("maximumSize must be a positive integer");
    this._maximumSize = size;
    return this;
  }

  /**
   * Entries expire this many ms after they were last WRITTEN (put or loaded).
   * On next access after expiry, cache misses and loader is called again.
   *
   * @param {number} ms
   * @returns {CacheBuilder}
   */
  expireAfterWrite(ms) {
    if (typeof ms !== "number" || ms < 0) throw new TypeError("expireAfterWrite must be a non-negative number");
    this._expireAfterWrite = ms;
    return this;
  }

  /**
   * Entries expire this many ms after they were last READ OR WRITTEN.
   * Effectively an idle timeout — entries that haven't been accessed recently expire.
   * If both expireAfterWrite and expireAfterAccess are set, both conditions are checked.
   *
   * @param {number} ms
   * @returns {CacheBuilder}
   */
  expireAfterAccess(ms) {
    if (typeof ms !== "number" || ms < 0) throw new TypeError("expireAfterAccess must be a non-negative number");
    this._expireAfterAccess = ms;
    return this;
  }

  /**
   * After this many ms since last write, the NEXT access returns the stale value
   * IMMEDIATELY and triggers a background reload. The value is never missing —
   * unlike expireAfterWrite which blocks callers until the loader finishes.
   *
   * Requires a bound loader (buildAsync). Ignored on build() without a loader.
   *
   * @param {number} ms
   * @returns {CacheBuilder}
   */
  refreshAfterWrite(ms) {
    if (typeof ms !== "number" || ms < 0) throw new TypeError("refreshAfterWrite must be a non-negative number");
    this._refreshAfterWrite = ms;
    return this;
  }

  /**
   * Callback fired whenever an entry is removed from the cache.
   * Receives (key, value, reason) where reason is 'size' | 'expired' | 'manual'.
   *
   * @param {(key: string, value: *, reason: string) => void} fn
   * @returns {CacheBuilder}
   */
  onEviction(fn) {
    if (typeof fn !== "function") throw new TypeError("onEviction must be a function");
    this._onEviction = fn;
    return this;
  }

  /**
   * Builds a cache WITHOUT a bound loader.
   * You must pass a loader to every cache.get(key, loader) call.
   *
   * @returns {CaffeineCache}
   */
  build() {
    return new CaffeineCache(this._buildOptions());
  }

  /**
   * Builds a cache WITH a bound async loader.
   * cache.get(key) loads automatically — no loader needed per call.
   *
   * @param {(key: string) => Promise<*>} loader
   * @returns {CaffeineCache}
   */
  buildAsync(loader) {
    if (typeof loader !== "function") throw new TypeError("buildAsync: loader must be a function");
    return new CaffeineCache({ ...this._buildOptions(), loader });
  }

  /** @private */
  _buildOptions() {
    return {
      maximumSize: this._maximumSize,
      expireAfterWrite: this._expireAfterWrite,
      expireAfterAccess: this._expireAfterAccess,
      refreshAfterWrite: this._refreshAfterWrite,
      onEviction: this._onEviction,
    };
  }
}

module.exports = { CacheBuilder };
