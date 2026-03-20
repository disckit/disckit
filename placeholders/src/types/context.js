/**
 * context.js — JSDoc type definitions for placeholder context objects.
 *
 * The PlaceholderEngine accepts plain objects (no Discord.js dependency).
 * The bot converts its Discord.js objects into these shapes via the adapter
 * in src/helpers/variables.js before calling the engine.
 *
 * The dashboard can build these objects directly from API data to render
 * live previews of welcome/farewell messages without needing Discord.js.
 */

/**
 * @typedef {Object} GuildContext
 * @property {string} name         - Server name
 * @property {string} id           - Server ID
 * @property {number} memberCount  - Total member count
 * @property {string} [icon]       - Icon URL (optional — may be null for servers without icon)
 */

/**
 * @typedef {Object} MemberContext
 * @property {string} id       - Discord user ID
 * @property {string} name     - Username (without discriminator)
 * @property {string} nick     - Display name (nickname if set, else username)
 * @property {string} dis      - Discriminator (e.g. "0" for new usernames)
 * @property {string} tag      - Full tag: username#discriminator
 * @property {string} mention  - Mention string: <@ID>
 * @property {string} [avatar] - Avatar URL (optional)
 */

/**
 * @typedef {Object} InviterContext
 * @property {string} [name]              - Username of the inviter
 * @property {string} [tag]               - Full tag of the inviter
 * @property {number} [effectiveInvites]  - Number of effective invites
 */

/**
 * @typedef {Object} ExtrasContext
 * @property {number|string} [level]  - Member level (XP system)
 * @property {number|string} [xp]     - Member XP amount
 * @property {number|string} [rank]   - Member rank on leaderboard
 * @property {number|string} [coins]  - Member coin balance
 */

/**
 * @typedef {Object} RoleResolverContext
 * @property {Function} resolve - (roleId: string) => string|null
 *   Returns the role mention string ("<@&ID>") or null if not found.
 *   The engine silently removes {role:ID} if this returns null.
 */

/**
 * @typedef {Object} PlaceholderContext
 * @property {GuildContext}          guild
 * @property {MemberContext}         member
 * @property {InviterContext}        [inviter]
 * @property {ExtrasContext}         [extras]
 * @property {RoleResolverContext}   [roles]
 */

/**
 * @typedef {Object} PresenceContext
 * @property {number} servers  - Total server count
 * @property {number} members  - Total member count across all servers
 */

module.exports = {};
