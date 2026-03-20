const { formatMs } = require("../util/formatMs");

/**
 * Per-user, per-guild, per-command cooldown manager.
 *
 * Unlike a generic rate limiter, CooldownManager is designed for bot commands:
 * it tracks per-key cooldowns, supports bypass lists (owner/mods) and
 * per-check duration overrides.
 */
class CooldownManager {
  /**
   * @param {object}   [options]
   * @param {number}   [options.default=3000]   Default cooldown in ms.
   * @param {string[]} [options.bypass=[]]      IDs that always bypass cooldowns.
   * @param {number}   [options.sweepEveryMs=0] Auto-sweep interval. 0 = disabled.
   */
  constructor(options = {}) {
    this._default   = options.default ?? 3000;
    this._bypass    = new Set(options.bypass ?? []);
    this._cooldowns = new Map(); // `${command}:${key}` → expiresAt (ms)

    this._sweepTimer = null;
    if (options.sweepEveryMs > 0) {
      this._sweepTimer = setInterval(() => this._sweep(), options.sweepEveryMs);
      if (this._sweepTimer.unref) this._sweepTimer.unref();
    }
  }

  // ── Core ───────────────────────────────────────────────────────────────────

  /**
   * Checks and applies a cooldown for a command + key combination.
   *
   * @param {string}  command
   * @param {string}  key       User ID, guild ID, or any string identifier
   * @param {object}  [options]
   * @param {number}  [options.duration]  Override duration for this check
   * @returns {{ ok: boolean, remaining: number, remainingText: string, expiresAt: number }}
   */
  check(command, key, options = {}) {
    if (this._bypass.has(key)) return { ok: true, remaining: 0, remainingText: "0s", expiresAt: 0 };

    const mapKey    = `${command}:${key}`;
    const now       = Date.now();
    const expiresAt = this._cooldowns.get(mapKey) ?? 0;

    if (expiresAt > now) {
      const remaining = expiresAt - now;
      return { ok: false, remaining, remainingText: formatMs(remaining), expiresAt };
    }

    const duration = options.duration ?? this._default;
    this._cooldowns.set(mapKey, now + duration);
    return { ok: true, remaining: 0, remainingText: "0s", expiresAt: now + duration };
  }

  /**
   * Applies a cooldown without returning the result.
   * Useful for fire-and-forget after a successful action.
   * @param {string} command
   * @param {string} key
   * @param {object} [options]
   * @param {number} [options.duration]
   */
  consume(command, key, options = {}) {
    this.check(command, key, options);
  }

  /**
   * @param {string} command
   * @param {string} key
   */
  peek(command, key) {
    if (this._bypass.has(key)) return { ok: true, remaining: 0, remainingText: "0s", expiresAt: 0 };
    const now       = Date.now();
    const expiresAt = this._cooldowns.get(`${command}:${key}`) ?? 0;
    const remaining = Math.max(0, expiresAt - now);
    return { ok: remaining === 0, remaining, remainingText: formatMs(remaining), expiresAt };
  }

  /** Resets the cooldown for a specific command + key. */
  reset(command, key) { this._cooldowns.delete(`${command}:${key}`); }

  /** Resets all cooldowns for a command across all keys. */
  resetCommand(command) {
    const prefix = `${command}:`;
    for (const k of this._cooldowns.keys()) {
      if (k.startsWith(prefix)) this._cooldowns.delete(k);
    }
  }

  /** Resets all cooldowns. */
  resetAll() { this._cooldowns.clear(); }

  // ── Bypass ─────────────────────────────────────────────────────────────────

  addBypass(id)    { this._bypass.add(id); return this; }
  removeBypass(id) { this._bypass.delete(id); return this; }
  isBypassed(id)   { return this._bypass.has(id); }

  // ── Stats / lifecycle ──────────────────────────────────────────────────────

  stats() {
    const now = Date.now();
    let active = 0;
    for (const exp of this._cooldowns.values()) if (exp > now) active++;
    return { active, bypassed: this._bypass.size };
  }

  destroy() {
    if (this._sweepTimer) clearInterval(this._sweepTimer);
    this._cooldowns.clear();
  }

  _sweep() {
    const now = Date.now();
    for (const [k, exp] of this._cooldowns) if (exp <= now) this._cooldowns.delete(k);
  }
}

module.exports = { CooldownManager };
