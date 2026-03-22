// Supports both CJS and ESM:
//   const { X } = require("@disckit/cooldown");   // CommonJS
//   import { X } from "@disckit/cooldown";         // ESM (Node >=18, bundlers)
//
// @disckit/cooldown — TypeScript definitions

export interface CooldownManagerOptions {
  /** Default cooldown duration in ms. Default: 3000. */
  default?: number;
  /** IDs that always bypass cooldowns (e.g. owner/mods). */
  bypass?: string[];
  /** Auto-sweep interval in ms. 0 = disabled. Default: 0. */
  sweepEveryMs?: number;
}

export interface CheckOptions {
  /** Override cooldown duration for this specific check. */
  duration?: number;
}

export interface CooldownResult {
  /** Whether the action is allowed (cooldown not active). */
  ok: boolean;
  /** Remaining cooldown in ms. 0 if allowed. */
  remaining: number;
  /** Human-readable remaining time (e.g. "2.5s", "3m"). */
  remainingText: string;
  /** Unix timestamp (ms) when the cooldown expires. 0 if allowed. */
  expiresAt: number;
}

export interface CooldownStats {
  /** Number of currently active (not expired) cooldowns. */
  active: number;
  /** Number of bypassed IDs. */
  bypassed: number;
}

/**
 * Per-user, per-guild, per-command cooldown manager.
 *
 * @example
 * const cooldown = new CooldownManager({ default: 5000 });
 *
 * // Check and apply cooldown
 * const result = cooldown.check("ban", userId);
 * if (!result.ok) {
 *   reply(`Wait ${result.remainingText} before using this again.`);
 *   return;
 * }
 *
 * // Consume without checking result (fire-and-forget)
 * cooldown.consume("daily", userId, { duration: 86_400_000 });
 */
export class CooldownManager {
  constructor(options?: CooldownManagerOptions);

  /**
   * Checks and applies a cooldown for a command + key combination.
   * If the cooldown is not active, it is set immediately.
   */
  check(command: string, key: string, options?: CheckOptions): CooldownResult;

  /**
   * Applies a cooldown without returning the result.
   * Useful for fire-and-forget scenarios after a successful action.
   */
  consume(command: string, key: string, options?: CheckOptions): void;

  /** Peeks at a cooldown without applying it. */
  peek(command: string, key: string): CooldownResult;

  /** Resets the cooldown for a specific command + key. */
  reset(command: string, key: string): void;

  /** Resets all cooldowns for a command across all keys. */
  resetCommand(command: string): void;

  /** Resets all cooldowns. */
  resetAll(): void;

  /** Adds an ID to the bypass list. */
  addBypass(id: string): this;

  /** Removes an ID from the bypass list. */
  removeBypass(id: string): this;

  /** Returns true if the ID is on the bypass list. */
  isBypassed(id: string): boolean;

  /** Returns stats about active cooldowns and bypass list size. */
  stats(): CooldownStats;

  /** Clears all cooldowns and stops the sweep timer. */
  destroy(): void;
}
