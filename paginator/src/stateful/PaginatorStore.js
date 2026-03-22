"use strict";

/**
 * PaginatorStore — manages multiple Paginator instances keyed by ID.
 *
 * The most common use case in Discord bots: one Paginator per user per
 * command interaction, with automatic cleanup after a timeout.
 *
 * @example
 * const store = new PaginatorStore({ ttlMs: 5 * 60 * 1000 });
 *
 * // Create or resume a paginator for this user
 * const pager = store.create(userId, { total: items.length, limit: 10 });
 * await interaction.reply(buildMessage(pager.slice(items)));
 *
 * // On button click
 * store.next(userId);
 * const pager = store.get(userId);
 * if (!pager) return interaction.reply({ content: "Session expired.", ephemeral: true });
 * await interaction.update(buildMessage(pager.slice(items)));
 */
class PaginatorStore {
  /**
   * @param {object} [options]
   * @param {number} [options.ttlMs=300_000]    Auto-delete entries after this many ms. 0 = disabled.
   * @param {number} [options.maxSize=500]       Max concurrent paginators. LRU eviction when full.
   * @param {number} [options.sweepEveryMs=60_000] How often to sweep expired entries. 0 = disabled.
   */
  constructor(options = {}) {
    const { Paginator } = require("./Paginator");
    this._Paginator    = Paginator;
    this._ttlMs        = options.ttlMs        ?? 300_000;
    this._maxSize      = options.maxSize       ?? 500;
    this._sweepEveryMs = options.sweepEveryMs  ?? 60_000;

    /** @type {Map<string, { pager: import("./Paginator").Paginator, createdAt: number, accessedAt: number }>} */
    this._store = new Map();

    this._sweepTimer = null;
    if (this._sweepEveryMs > 0) {
      this._sweepTimer = setInterval(() => this._sweep(), this._sweepEveryMs);
      if (this._sweepTimer.unref) this._sweepTimer.unref();
    }
  }

  // ── Creation ───────────────────────────────────────────────────────────────

  /**
   * Creates a new Paginator for key (always creates fresh, even if one exists).
   * @param {string} key
   * @param {import("./Paginator").PaginatorOptions} paginatorOptions
   * @returns {import("./Paginator").Paginator}
   */
  create(key, paginatorOptions) {
    this._evictLRUIfFull();
    const pager = new this._Paginator(paginatorOptions);
    const now   = Date.now();
    this._store.set(key, { pager, createdAt: now, accessedAt: now });
    return pager;
  }

  /**
   * Returns an existing Paginator for key, or creates one if not found / expired.
   * Alias for `create()` when you want idempotent behavior.
   * @param {string} key
   * @param {import("./Paginator").PaginatorOptions} paginatorOptions
   * @returns {import("./Paginator").Paginator}
   */
  getOrCreate(key, paginatorOptions) {
    const existing = this._getEntry(key);
    if (existing) return existing.pager;
    return this.create(key, paginatorOptions);
  }

  // ── Access ─────────────────────────────────────────────────────────────────

  /**
   * Returns an existing Paginator, or undefined if not found or expired.
   * Updates the access time on hit.
   * @param {string} key
   * @returns {import("./Paginator").Paginator|undefined}
   */
  get(key) {
    const entry = this._getEntry(key);
    return entry?.pager;
  }

  /**
   * Returns true if a non-expired Paginator exists for key.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._getEntry(key) !== undefined;
  }

  /**
   * Returns all active (non-expired) keys.
   * @returns {string[]}
   */
  keys() {
    const now = Date.now();
    const result = [];
    for (const [key, entry] of this._store) {
      if (this._ttlMs === 0 || now - entry.accessedAt <= this._ttlMs) {
        result.push(key);
      }
    }
    return result;
  }

  // ── Navigation shortcuts ───────────────────────────────────────────────────

  /**
   * Advances the paginator for key to the next page.
   * Returns the updated paginator, or undefined if not found.
   * @param {string} key
   * @returns {import("./Paginator").Paginator|undefined}
   */
  next(key) { const p = this.get(key); p?.next(); return p; }

  /**
   * Goes back to the previous page for key.
   * Returns the updated paginator, or undefined if not found.
   * @param {string} key
   * @returns {import("./Paginator").Paginator|undefined}
   */
  prev(key) { const p = this.get(key); p?.prev(); return p; }

  /**
   * Jumps to the given page for key.
   * Returns the updated paginator, or undefined if not found.
   * @param {string} key
   * @param {number} page
   * @returns {import("./Paginator").Paginator|undefined}
   */
  goTo(key, page) { const p = this.get(key); p?.goTo(page); return p; }

  // ── Removal ────────────────────────────────────────────────────────────────

  /**
   * Manually removes a paginator from the store.
   * @param {string} key
   * @returns {boolean}
   */
  delete(key) { return this._store.delete(key); }

  /** Removes all entries. */
  clear() { this._store.clear(); }

  // ── Metadata ───────────────────────────────────────────────────────────────

  /** @returns {number} current number of tracked paginators (including expired). */
  get size() { return this._store.size; }

  /** Stop the sweep timer and clear all entries. */
  destroy() {
    if (this._sweepTimer) clearInterval(this._sweepTimer);
    this._store.clear();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _getEntry(key) {
    const entry = this._store.get(key);
    if (!entry) return undefined;
    const now = Date.now();
    if (this._ttlMs > 0 && now - entry.accessedAt > this._ttlMs) {
      this._store.delete(key);
      return undefined;
    }
    entry.accessedAt = now;
    return entry;
  }

  _evictLRUIfFull() {
    if (this._store.size < this._maxSize) return;
    let oldestKey = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this._store) {
      if (entry.accessedAt < oldestTime) {
        oldestTime = entry.accessedAt;
        oldestKey  = key;
      }
    }
    if (oldestKey) this._store.delete(oldestKey);
  }

  _sweep() {
    if (this._ttlMs === 0) return;
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now - entry.accessedAt > this._ttlMs) this._store.delete(key);
    }
  }
}

module.exports = { PaginatorStore };
