// BucketStore — stores sliding-window hit timestamps + penalty state per key.
// Each bucket: { hits: number[], penaltyUntil: number, excessCount: number }

class BucketStore {
  constructor() {
    /** @type {Map<string, { hits: number[], penaltyUntil: number, excessCount: number }>} */
    this._store = new Map();
  }

  /**
   * Get or create a bucket for the given key.
   * @param {string} key
   */
  get(key) {
    if (!this._store.has(key)) {
      this._store.set(key, { hits: [], penaltyUntil: 0, excessCount: 0 });
    }
    return this._store.get(key);
  }

  /**
   * Prune hits outside the sliding window and remove stale buckets.
   * Should be called before every check to keep memory bounded.
   * @param {string} key
   * @param {number} windowMs
   * @param {number} now
   */
  prune(key, windowMs, now) {
    const bucket = this._store.get(key);
    if (!bucket) return;

    bucket.hits = bucket.hits.filter(ts => now - ts < windowMs);

    // Remove bucket entirely if it has no hits and no active penalty
    if (bucket.hits.length === 0 && bucket.penaltyUntil <= now) {
      this._store.delete(key);
    }
  }

  /**
   * Add a hit timestamp to the bucket.
   * @param {string} key
   * @param {number} now
   */
  addHit(key, now) {
    const bucket = this.get(key);
    bucket.hits.push(now);
  }

  /**
   * Apply progressive penalty based on excess hits.
   * @param {string} key
   * @param {"ADDITIVE"|"EXPONENTIAL"} mode
   * @param {number} step  — ms per excess hit (ADDITIVE) or base ms (EXPONENTIAL)
   * @param {number} max   — hard cap in ms
   * @param {number} now
   * @returns {number} penaltyUntil timestamp
   */
  applyPenalty(key, mode, step, max, now) {
    const bucket = this.get(key);
    bucket.excessCount += 1;

    let addedMs;
    if (mode === "EXPONENTIAL") {
      // 2^(excessCount-1) * step, capped at max
      addedMs = Math.min(Math.pow(2, bucket.excessCount - 1) * step, max);
    } else {
      // ADDITIVE: excessCount * step, capped at max
      addedMs = Math.min(bucket.excessCount * step, max);
    }

    // Penalty stacks from current time, not from previous penaltyUntil
    bucket.penaltyUntil = now + addedMs;
    return bucket.penaltyUntil;
  }

  /**
   * Reset excess counter after the penalty expires.
   * @param {string} key
   * @param {number} now
   */
  tryResetPenalty(key, now) {
    const bucket = this._store.get(key);
    if (!bucket) return;
    if (bucket.penaltyUntil > 0 && bucket.penaltyUntil <= now) {
      bucket.excessCount = 0;
      bucket.penaltyUntil = 0;
    }
  }

  /**
   * Fully reset a key (e.g. when a DEV clears a user's flood state).
   * @param {string} key
   */
  reset(key) {
    this._store.delete(key);
  }

  /** @returns {number} total tracked buckets */
  get size() {
    return this._store.size;
  }

  /** Clear all buckets (for tests / restart). */
  clear() {
    this._store.clear();
  }
}

module.exports = { BucketStore };
