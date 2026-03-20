/**
 * CaffeineCache — Caffeine-inspired async cache for Node.js.
 *
 * Features (matching the Java Caffeine library semantics):
 *   - Builder pattern (CacheBuilder.newBuilder()...)
 *   - expireAfterWrite(ms)   — entry expires N ms after it was last written
 *   - expireAfterAccess(ms)  — entry expires N ms after it was last READ (idle timeout)
 *   - refreshAfterWrite(ms)  — after N ms, a background reload fires on next access;
 *                              caller gets the STALE value immediately (no wait)
 *   - buildAsync(loader)     — binds an async loader; cache.get(key) loads automatically
 *   - build()                — no bound loader; use cache.get(key, loader) per-call
 *   - onEviction(fn)         — callback fired when an entry is evicted for any reason
 *   - request coalescing     — concurrent get() for the same key → 1 loader call
 *
 * Zero external dependencies. Pure Node.js doubly-linked-list + Map LRU.
 */

const {
  DEFAULT_MAX_SIZE,
  DEFAULT_EXPIRE_AFTER_WRITE,
  DEFAULT_EXPIRE_AFTER_ACCESS,
  DEFAULT_REFRESH_AFTER_WRITE,
} = require("../constants/defaults");

// ── LRU Node ──────────────────────────────────────────────────────────────────

class Node {
  constructor(key, entry) {
    this.key = key;
    this.entry = entry; // { value, writtenAt, accessedAt }
    this.prev = null;
    this.next = null;
  }
}

// ── CaffeineCache ─────────────────────────────────────────────────────────────

class CaffeineCache {
  /**
   * @param {object} options
   * @param {number}   options.maximumSize
   * @param {number}   options.expireAfterWrite   ms, 0 = never
   * @param {number}   options.expireAfterAccess  ms, 0 = never
   * @param {number}   options.refreshAfterWrite  ms, 0 = disabled
   * @param {Function} [options.loader]           async (key) => value
   * @param {Function} [options.onEviction]       (key, value, reason) => void
   *                                              reason: 'size' | 'expired' | 'manual'
   */
  constructor(options = {}) {
    this._maxSize = options.maximumSize || DEFAULT_MAX_SIZE;
    this._expireAfterWrite = options.expireAfterWrite || DEFAULT_EXPIRE_AFTER_WRITE;
    this._expireAfterAccess = options.expireAfterAccess || DEFAULT_EXPIRE_AFTER_ACCESS;
    this._refreshAfterWrite = options.refreshAfterWrite || DEFAULT_REFRESH_AFTER_WRITE;
    this._loader = options.loader || null;
    this._onEviction = options.onEviction || null;

    // LRU internals
    this._map = new Map();
    this._head = new Node(null, null); // sentinel oldest
    this._tail = new Node(null, null); // sentinel newest
    this._head.next = this._tail;
    this._tail.prev = this._head;
    this._size = 0;

    // In-flight Promises for request coalescing
    this._inflight = new Map();

    // Stats
    this._stats = { hits: 0, misses: 0, loads: 0, errors: 0, coalesced: 0, evictions: 0, refreshes: 0 };
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Returns the value for key.
   *
   * - If cached and not expired → returns immediately (hit).
   * - If stale (refreshAfterWrite exceeded) → returns stale value NOW,
   *   triggers background refresh.
   * - If expired or missing → calls loader (bound or per-call).
   * - If multiple callers race for the same key → coalesces into 1 loader call.
   *
   * @param {string}   key
   * @param {Function} [loader]  async (key) => value  — required if no bound loader
   * @returns {Promise<*>}
   */
  async get(key, loader) {
    const now = Date.now();
    const node = this._map.get(key);

    if (node) {
      const entry = node.entry;

      // Expired?
      if (this._isExpired(entry, now)) {
        this._evict(node, "expired");
        // fall through to load
      } else {
        // Stale (refreshAfterWrite) — return immediately, reload in background
        if (this._isStale(entry, now)) {
          this._stats.hits++;
          entry.accessedAt = now;
          this._moveToTail(node);
          this._backgroundRefresh(key, loader || this._loader, now);
          return entry.value;
        }

        // Fresh hit
        this._stats.hits++;
        entry.accessedAt = now;
        this._moveToTail(node);
        return entry.value;
      }
    }

    // Miss — load
    this._stats.misses++;
    return this._load(key, loader || this._loader);
  }

  /**
   * Manually writes a value into the cache, bypassing the loader.
   *
   * @param {string} key
   * @param {*}      value
   */
  put(key, value) {
    const now = Date.now();
    const entry = { value, writtenAt: now, accessedAt: now };

    const existing = this._map.get(key);
    if (existing) {
      existing.entry = entry;
      this._moveToTail(existing);
      return;
    }

    if (this._size >= this._maxSize) {
      const lru = this._head.next;
      if (lru !== this._tail) this._evict(lru, "size");
    }

    const node = new Node(key, entry);
    this._map.set(key, node);
    this._linkBeforeTail(node);
    this._size++;
  }

  /**
   * Returns the value if present and not expired.
   * Counts as an access — updates the idle timer (expireAfterAccess) and LRU position.
   * Returns undefined if not found or expired.
   *
   * @param {string} key
   * @returns {*|undefined}
   */
  getIfPresent(key) {
    const now = Date.now();
    const node = this._map.get(key);
    if (!node) return undefined;
    if (this._isExpired(node.entry, now)) {
      this._evict(node, "expired");
      return undefined;
    }
    node.entry.accessedAt = now;
    this._moveToTail(node);
    return node.entry.value;
  }

  /**
   * Returns true if key is present and not expired.
   *
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.getIfPresent(key) !== undefined;
  }

  /**
   * Manually removes a key. Triggers onEviction with reason 'manual'.
   *
   * @param {string} key
   * @returns {boolean}
   */
  invalidate(key) {
    const node = this._map.get(key);
    if (!node) return false;
    this._inflight.delete(key);
    this._evict(node, "manual");
    return true;
  }

  /**
   * Removes all entries. Triggers onEviction for each.
   */
  invalidateAll() {
    this._inflight.clear();
    for (const node of this._map.values()) {
      this._fireEviction(node.key, node.entry.value, "manual");
    }
    this._map.clear();
    this._head.next = this._tail;
    this._tail.prev = this._head;
    this._size = 0;
  }

  /**
   * Proactively removes all expired entries.
   * CaffeineCache normally evicts lazily (on access).
   * Call this periodically if you want tighter memory control.
   *
   * @returns {number} number of entries evicted
   */
  cleanUp() {
    const now = Date.now();
    let count = 0;
    for (const node of [...this._map.values()]) {
      if (this._isExpired(node.entry, now)) {
        this._evict(node, "expired");
        count++;
      }
    }
    return count;
  }

  /**
   * Snapshot of cache performance counters.
   *
   * @returns {{ hits, misses, loads, errors, coalesced, evictions, refreshes, size, inflight }}
   */
  get stats() {
    return { ...this._stats, size: this._size, inflight: this._inflight.size };
  }

  /** Resets all stat counters. */
  resetStats() {
    this._stats = { hits: 0, misses: 0, loads: 0, errors: 0, coalesced: 0, evictions: 0, refreshes: 0 };
  }

  /** Current number of entries (includes stale, excludes expired-but-not-yet-evicted). */
  get size() { return this._size; }

  // ── Private — loading ─────────────────────────────────────────────────────

  async _load(key, loader) {
    if (!loader) throw new Error(`CaffeineCache: no loader for key "${key}". Use buildAsync(loader) or pass a per-call loader to get().`);

    // Coalesce — already loading?
    if (this._inflight.has(key)) {
      this._stats.coalesced++;
      return this._inflight.get(key);
    }

    this._stats.loads++;

    const promise = (async () => {
      try {
        const value = await loader(key);
        this.put(key, value);
        return value;
      } catch (err) {
        this._stats.errors++;
        throw err;
      } finally {
        this._inflight.delete(key);
      }
    })();

    this._inflight.set(key, promise);
    return promise;
  }

  _backgroundRefresh(key, loader, now) {
    if (!loader) return;
    if (this._inflight.has(key)) return; // already refreshing

    this._stats.refreshes++;

    const promise = (async () => {
      try {
        const value = await loader(key);
        this.put(key, value);
      } catch {
        // background refresh errors are silent — stale data stays
      } finally {
        this._inflight.delete(key);
      }
    })();

    this._inflight.set(key, promise);
  }

  // ── Private — expiry ──────────────────────────────────────────────────────

  _isExpired(entry, now) {
    if (this._expireAfterWrite > 0 && now - entry.writtenAt > this._expireAfterWrite) return true;
    if (this._expireAfterAccess > 0 && now - entry.accessedAt > this._expireAfterAccess) return true;
    return false;
  }

  _isStale(entry, now) {
    if (this._refreshAfterWrite > 0 && now - entry.writtenAt > this._refreshAfterWrite) return true;
    return false;
  }

  // ── Private — LRU ─────────────────────────────────────────────────────────

  _evict(node, reason) {
    this._unlink(node);
    this._map.delete(node.key);
    this._size--;
    this._stats.evictions++;
    this._fireEviction(node.key, node.entry.value, reason);
  }

  _fireEviction(key, value, reason) {
    if (this._onEviction) {
      try { this._onEviction(key, value, reason); } catch {}
    }
  }

  _unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _linkBeforeTail(node) {
    node.prev = this._tail.prev;
    node.next = this._tail;
    this._tail.prev.next = node;
    this._tail.prev = node;
  }

  _moveToTail(node) {
    this._unlink(node);
    this._linkBeforeTail(node);
  }
}

module.exports = { CaffeineCache };
