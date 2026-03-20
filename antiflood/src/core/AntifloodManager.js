// AntifloodManager — central rate limiter.
// Keyed by: commandName + userId + guildId  (any field can be wildcarded with "*")
// Whitelisted roleIds bypass all checks.

const { BucketStore } = require("./BucketStore");
const { createRule } = require("./AntifloodRule");
const { FLOOD_RESULT, PENALTY_MODE, DEFAULT_RULE } = require("../constants");

class AntifloodManager {
  /**
   * @param {object} [options]
   * @param {object} [options.globalRule]  — default rule applied when no command-level rule matches
   * @param {Set<string>|string[]} [options.whitelistRoleIds] — roleIds that always bypass flood checks
   * @param {boolean} [options.enabled]   — master switch (default true)
   */
  constructor(options = {}) {
    this._globalRule = createRule(options.globalRule || {});
    this._commandRules = new Map(); // commandName → rule
    this._store = new BucketStore();
    this._whitelist = new Set(options.whitelistRoleIds || []);
    this._enabled = options.enabled !== false;
  }

  // ── Configuration ─────────────────────────────────────────────────────────

  /**
   * Register a per-command rule. Overrides the global rule for that command.
   * @param {string} commandName
   * @param {object} ruleConfig
   */
  setRule(commandName, ruleConfig) {
    this._commandRules.set(commandName, createRule(ruleConfig));
    return this;
  }

  /**
   * Returns true if a per-command rule is registered for the given command name.
   * Prefer this over accessing `_commandRules` directly.
   * @param {string} commandName
   * @returns {boolean}
   */
  hasRule(commandName) {
    return this._commandRules.has(commandName);
  }

  /**
   * Add one or more roleIds to the whitelist.
   * @param {...string} roleIds
   */
  addWhitelist(...roleIds) {
    for (const id of roleIds) this._whitelist.add(String(id));
    return this;
  }

  /**
   * Remove a roleId from the whitelist.
   * @param {string} roleId
   */
  removeWhitelist(roleId) {
    this._whitelist.delete(String(roleId));
    return this;
  }

  /** Disable all flood checks (e.g. during maintenance). */
  disable() { this._enabled = false; return this; }

  /** Re-enable flood checks. */
  enable()  { this._enabled = true;  return this; }

  // ── Check ─────────────────────────────────────────────────────────────────

  /**
   * Check if the given request should be allowed or throttled.
   *
   * @param {object} params
   * @param {string} params.userId
   * @param {string} [params.guildId]        — optional; included in key for guild isolation
   * @param {string} [params.commandName]    — optional; used to look up per-command rule
   * @param {string[]} [params.memberRoleIds] — user's current roles, checked against whitelist
   *
   * @returns {{
   *   result: string,         // FLOOD_RESULT value
   *   retryAfterMs: number,   // ms until the user can try again (0 if ALLOWED/WHITELISTED)
   *   hitsInWindow: number,   // how many hits recorded in current window
   *   penaltyUntil: number,   // timestamp when penalty expires (0 if none)
   *   rule: object            // the rule that was applied
   * }}
   */
  check({ userId, guildId = "*", commandName = "*", memberRoleIds = [] }) {
    // Master switch
    if (!this._enabled) {
      return this._buildResult(FLOOD_RESULT.ALLOWED, 0, 0, 0, this._globalRule);
    }

    // Whitelist check — any matching roleId bypasses everything
    for (const rid of memberRoleIds) {
      if (this._whitelist.has(String(rid))) {
        return this._buildResult(FLOOD_RESULT.WHITELISTED, 0, 0, 0, this._globalRule);
      }
    }

    const rule = this._commandRules.get(commandName) || this._globalRule;
    const key = this._buildKey(commandName, userId, guildId);
    const now = Date.now();

    // Try to reset expired penalty first
    this._store.tryResetPenalty(key, now);

    // Prune stale hits from the sliding window
    this._store.prune(key, rule.windowMs, now);

    const bucket = this._store.get(key);

    // ── Active penalty lock ──────────────────────────────────────────────────
    if (bucket.penaltyUntil > now) {
      return this._buildResult(
        FLOOD_RESULT.PENALIZED,
        bucket.penaltyUntil - now,
        bucket.hits.length,
        bucket.penaltyUntil,
        rule,
      );
    }

    // ── Hit is within quota ──────────────────────────────────────────────────
    if (bucket.hits.length < rule.maxHits) {
      this._store.addHit(key, now);
      return this._buildResult(FLOOD_RESULT.ALLOWED, 0, bucket.hits.length, 0, rule);
    }

    // ── Quota exceeded ───────────────────────────────────────────────────────
    if (rule.penaltyMode === PENALTY_MODE.NONE) {
      // No progressive penalty — just block until the window slides
      const oldestHit = bucket.hits[0];
      const retryAfterMs = rule.windowMs - (now - oldestHit);
      return this._buildResult(
        FLOOD_RESULT.THROTTLED,
        Math.max(retryAfterMs, 0),
        bucket.hits.length,
        0,
        rule,
      );
    }

    // Progressive penalty
    this._store.addHit(key, now);
    const penaltyUntil = this._store.applyPenalty(
      key,
      rule.penaltyMode,
      rule.penaltyStep,
      rule.maxPenalty,
      now,
    );

    return this._buildResult(
      FLOOD_RESULT.PENALIZED,
      penaltyUntil - now,
      bucket.hits.length,
      penaltyUntil,
      rule,
    );
  }

  // ── Manual controls ───────────────────────────────────────────────────────

  /**
   * Manually reset a user's flood state for a given command + guild.
   * Use this when a DEV/OWNER wants to unblock someone immediately.
   */
  reset({ userId, guildId = "*", commandName = "*" }) {
    this._store.reset(this._buildKey(commandName, userId, guildId));
  }

  /** Reset all flood state (e.g. on bot restart). */
  resetAll() {
    this._store.clear();
  }

  /** @returns {number} number of active tracked buckets. */
  get activeBuckets() {
    return this._store.size;
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  _buildKey(commandName, userId, guildId) {
    return `${commandName}|${userId}|${guildId}`;
  }

  _buildResult(result, retryAfterMs, hitsInWindow, penaltyUntil, rule) {
    return { result, retryAfterMs: Math.ceil(retryAfterMs), hitsInWindow, penaltyUntil, rule };
  }
}

module.exports = { AntifloodManager };
