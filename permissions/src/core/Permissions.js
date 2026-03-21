const { PermissionsBits } = require("../data/PermissionsBits");

/**
 * Wraps a Discord permission bitfield in a clean, human-readable API.
 * Does not require discord.js.
 */
class Permissions {
  /**
   * @param {bigint|number|string|string[]} [input]
   *   - bigint / number → raw bitfield
   *   - string          → single permission name (e.g. "ADMINISTRATOR")
   *   - string[]        → array of permission names
   */
  constructor(input) {
    this._bitfield = Permissions._resolve(input ?? 0n);
  }

  // ── Checks ─────────────────────────────────────────────────────────────────

  /** Returns true if ALL of the given permissions are set. ADMINISTRATOR always returns true. */
  has(perms) {
    const bits = Permissions._resolve(perms);
    if (this._bitfield & PermissionsBits.ADMINISTRATOR) return true;
    return (this._bitfield & bits) === bits;
  }

  /** Returns true if ANY of the given permissions are set. ADMINISTRATOR always returns true. */
  any(perms) {
    const bits = Permissions._resolve(perms);
    if (this._bitfield & PermissionsBits.ADMINISTRATOR) return true;
    return (this._bitfield & bits) !== 0n;
  }

  /** Returns the permission names that are in perms but NOT in this bitfield. */
  missing(perms) {
    return perms.filter((p) => !this.has(p));
  }

  // ── Mutation (returns new instance — originals are never mutated) ───────────

  /** Returns a new Permissions with the given permissions added. */
  add(perms) { return new Permissions(this._bitfield | Permissions._resolve(perms)); }

  /** Returns a new Permissions with the given permissions removed. */
  remove(perms) { return new Permissions(this._bitfield & ~Permissions._resolve(perms)); }

  /**
   * Returns the difference between this bitfield and another.
   * Useful for logging which permissions were added or removed.
   *
   * @param {bigint|number|string|string[]|Permissions} other
   * @returns {{ added: string[], removed: string[] }}
   *
   * @example
   * const before = new Permissions(["SEND_MESSAGES"]);
   * const after  = new Permissions(["SEND_MESSAGES", "MANAGE_MESSAGES"]);
   * after.diff(before); // → { added: ["MANAGE_MESSAGES"], removed: [] }
   */
  diff(other) {
    const otherBits = other instanceof Permissions
      ? other._bitfield
      : Permissions._resolve(other);
    const added   = new Permissions(this._bitfield & ~otherBits).toArray();
    const removed = new Permissions(otherBits & ~this._bitfield).toArray();
    return { added, removed };
  }

  // ── Output ─────────────────────────────────────────────────────────────────

  get bitfield() { return this._bitfield; }

  /** Returns all set permission names. Does NOT expand ADMINISTRATOR. */
  toArray() {
    return Object.entries(PermissionsBits)
      .filter(([, bit]) => (this._bitfield & bit) === bit)
      .map(([name]) => name);
  }

  /** Returns the bitfield as a decimal string — safe for JSON serialization. */
  toString() { return this._bitfield.toString(); }
  toJSON()   { return this.toString(); }

  // ── Static ─────────────────────────────────────────────────────────────────

  static from(bitfield)  { return new Permissions(bitfield); }
  static resolve(names)  { return Permissions._resolve(names); }

  static _resolve(input) {
    if (typeof input === "bigint")  return input;
    if (typeof input === "number")  return BigInt(input);
    if (typeof input === "string") {
      const bit = PermissionsBits[input];
      if (bit === undefined) throw new RangeError(`Unknown permission: "${input}"`);
      return bit;
    }
    if (Array.isArray(input)) return input.reduce((acc, p) => acc | Permissions._resolve(p), 0n);
    throw new TypeError(`Cannot resolve permissions from: ${typeof input}`);
  }
}

module.exports = { Permissions };
