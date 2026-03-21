// Supports both CJS and ESM:
//   const { X } = require("@disckit/permissions");   // CommonJS
//   import { X } from "@disckit/permissions";         // ESM (Node >=18, bundlers)
//
// @disckit/permissions — TypeScript definitions

export type PermissionName = keyof typeof PermissionsBits;

export type PermissionResolvable =
  | bigint
  | number
  | PermissionName
  | PermissionName[];

/**
 * All Discord permission flags as named BigInt constants.
 * Matches the Discord API permission bitfield values.
 */
export declare const PermissionsBits: Readonly<{
  CREATE_INSTANT_INVITE:               bigint;
  KICK_MEMBERS:                        bigint;
  BAN_MEMBERS:                         bigint;
  ADMINISTRATOR:                       bigint;
  MANAGE_CHANNELS:                     bigint;
  MANAGE_GUILD:                        bigint;
  ADD_REACTIONS:                       bigint;
  VIEW_AUDIT_LOG:                      bigint;
  PRIORITY_SPEAKER:                    bigint;
  STREAM:                              bigint;
  VIEW_CHANNEL:                        bigint;
  SEND_MESSAGES:                       bigint;
  SEND_TTS_MESSAGES:                   bigint;
  MANAGE_MESSAGES:                     bigint;
  EMBED_LINKS:                         bigint;
  ATTACH_FILES:                        bigint;
  READ_MESSAGE_HISTORY:                bigint;
  MENTION_EVERYONE:                    bigint;
  USE_EXTERNAL_EMOJIS:                 bigint;
  VIEW_GUILD_INSIGHTS:                 bigint;
  CONNECT:                             bigint;
  SPEAK:                               bigint;
  MUTE_MEMBERS:                        bigint;
  DEAFEN_MEMBERS:                      bigint;
  MOVE_MEMBERS:                        bigint;
  USE_VAD:                             bigint;
  CHANGE_NICKNAME:                     bigint;
  MANAGE_NICKNAMES:                    bigint;
  MANAGE_ROLES:                        bigint;
  MANAGE_WEBHOOKS:                     bigint;
  MANAGE_GUILD_EXPRESSIONS:            bigint;
  USE_APPLICATION_COMMANDS:            bigint;
  REQUEST_TO_SPEAK:                    bigint;
  MANAGE_EVENTS:                       bigint;
  MANAGE_THREADS:                      bigint;
  CREATE_PUBLIC_THREADS:               bigint;
  CREATE_PRIVATE_THREADS:              bigint;
  USE_EXTERNAL_STICKERS:               bigint;
  SEND_MESSAGES_IN_THREADS:            bigint;
  USE_EMBEDDED_ACTIVITIES:             bigint;
  MODERATE_MEMBERS:                    bigint;
  VIEW_CREATOR_MONETIZATION_ANALYTICS: bigint;
  USE_SOUNDBOARD:                      bigint;
  CREATE_GUILD_EXPRESSIONS:            bigint;
  CREATE_EVENTS:                       bigint;
  USE_EXTERNAL_SOUNDS:                 bigint;
  SEND_VOICE_MESSAGES:                 bigint;
  SEND_POLLS:                          bigint;
  USE_EXTERNAL_APPS:                   bigint;
}>;

/**
 * Wraps a Discord permission bitfield in a clean, human-readable API.
 * Does not require discord.js.
 *
 * @example
 * const perms = new Permissions(["BAN_MEMBERS", "KICK_MEMBERS"]);
 * perms.has("BAN_MEMBERS"); // true
 * perms.toArray();          // ["BAN_MEMBERS", "KICK_MEMBERS"]
 */
export class Permissions {
  constructor(input?: PermissionResolvable);

  /** The raw permission bitfield. */
  readonly bitfield: bigint;

  /** Returns true if ALL given permissions are set. ADMINISTRATOR always returns true. */
  has(perms: PermissionResolvable): boolean;

  /** Returns true if ANY of the given permissions are set. ADMINISTRATOR always returns true. */
  any(perms: PermissionResolvable): boolean;

  /** Returns the permission names that are in perms but NOT in this bitfield. */
  missing(perms: PermissionName[]): PermissionName[];

  /** Returns a new Permissions with the given permissions added. */
  add(perms: PermissionResolvable): Permissions;

  /** Returns a new Permissions with the given permissions removed. */
  remove(perms: PermissionResolvable): Permissions;

  /** Returns all set permission names. */
  toArray(): PermissionName[];

  /** Returns the bitfield as a decimal string — safe for JSON. */
  toString(): string;
  toJSON(): string;

  static from(bitfield: PermissionResolvable): Permissions;
  static resolve(names: PermissionResolvable): bigint;
}
