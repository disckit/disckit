/**
 * VARIABLES — Predefined placeholder definitions for @disckit/placeholders.
 *
 * Covers the variables resolved by applyPlaceholders().
 * Use this to build help UI, validate templates, or list available tokens.
 */

const VARIABLES = [
  // ── Guild ─────────────────────────────────────────────────────────────────
  { key: "{server}",             group: "guild",   description: "Server name",                             example: "My Server"              },
  { key: "{guild:name}",         group: "guild",   description: "Server name (alias for {server})",       example: "My Server"              },
  { key: "{guild:id}",           group: "guild",   description: "Server ID",                              example: "123456789012345678"      },
  { key: "{count}",              group: "guild",   description: "Total member count",                     example: "1500"                   },
  { key: "{guild:memberCount}",  group: "guild",   description: "Total member count (alias for {count})", example: "1500"                   },
  { key: "{guild:icon}",         group: "guild",   description: "Server icon URL",                        example: "https://cdn.discordapp.com/icons/..." },

  // ── Member ────────────────────────────────────────────────────────────────
  { key: "{member:id}",          group: "member",  description: "Member's Discord ID",                    example: "987654321098765432"      },
  { key: "{member:name}",        group: "member",  description: "Member's username",                      example: "john"                   },
  { key: "{member:nick}",        group: "member",  description: "Display name (nickname or username)",    example: "John Doe"               },
  { key: "{member:dis}",         group: "member",  description: "Discriminator",                          example: "0"                      },
  { key: "{member:tag}",         group: "member",  description: "Full tag (username#discriminator)",      example: "john#0"                 },
  { key: "{member:mention}",     group: "member",  description: "Clickable mention of the member",        example: "<@987654321098765432>"   },
  { key: "{member:avatar}",      group: "member",  description: "Member's avatar URL",                    example: "https://cdn.discordapp.com/avatars/..." },

  // ── Inviter ───────────────────────────────────────────────────────────────
  { key: "{inviter:name}",       group: "inviter", description: "Username of the member who sent the invite",    example: "inviter"            },
  { key: "{inviter:tag}",        group: "inviter", description: "Full tag of the member who sent the invite",    example: "inviter#0"          },
  { key: "{invites}",            group: "inviter", description: "Number of effective invites the inviter has",   example: "42"                 },

  // ── Extras ────────────────────────────────────────────────────────────────
  { key: "{level}",              group: "extras",  description: "Member's current level",                 example: "15"                     },
  { key: "{xp}",                 group: "extras",  description: "Member's current XP amount",             example: "3200"                   },
  { key: "{rank}",               group: "extras",  description: "Member's rank position on leaderboard",  example: "3"                      },
  { key: "{coins}",              group: "extras",  description: "Member's coin balance",                  example: "5000"                   },

  // ── Role ──────────────────────────────────────────────────────────────────
  { key: "{role:ID}",            group: "role",    description: "Mention a role by its ID. Silently removed if role does not exist.", example: "<@&123456789>" },

  // ── Presence ──────────────────────────────────────────────────────────────
  { key: "{servers}",            group: "presence", description: "Total number of servers the bot is in",  example: "500"                   },
  { key: "{members}",            group: "presence", description: "Total member count across all servers",  example: "120000"                },
];

/** @param {string} group */
function getByGroup(group) { return VARIABLES.filter(v => v.group === group); }

/** @returns {string[]} */
function getAllKeys() { return VARIABLES.map(v => v.key); }

/** @param {string} key */
function findByKey(key) { return VARIABLES.find(v => v.key === key); }

module.exports = { VARIABLES, getByGroup, getAllKeys, findByKey };
