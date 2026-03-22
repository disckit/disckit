/**
 * PresenceEngine — Presence placeholder substitution for Discord bots and dashboards.
 *
 * Handles the {servers} and {members} variables used in bot status messages.
 * These require live data from the bot runtime, so they are separate from
 * the main PlaceholderEngine which works with per-member context.
 *
 * Supports synchronous (single-process) and asynchronous (sharded) modes.
 */

/**
 * Apply presence placeholders to a bot status string.
 * Works in both standalone and sharded modes.
 *
 * In standalone mode, pass the counts directly:
 *   applyPresencePlaceholders("{servers} servers", { servers: 10, members: 5000 })
 *
 * In sharded mode, pass a resolver function that fetches across shards:
 *   applyPresencePlaceholders("{servers} servers", { resolver: async () => ({ servers, members }) })
 *
 * @param {string} message - Status string with {servers} and/or {members}
 * @param {import("../types/context").PresenceContext|{ resolver: () => Promise<import("../types/context").PresenceContext> }} context
 * @returns {Promise<string>}
 */
async function applyPresencePlaceholders(message, context) {
  if (typeof message !== "string") return "";
  if (!message.includes("{servers}") && !message.includes("{members}")) return message;

  let servers;
  let members;

  if (typeof context.resolver === "function") {
    const data = await context.resolver();
    servers = data.servers;
    members = data.members;
  } else {
    servers = context.servers;
    members = context.members;
  }

  let result = message;
  if (result.includes("{servers}")) result = result.split("{servers}").join(String(servers ?? 0));
  if (result.includes("{members}")) result = result.split("{members}").join(String(members ?? 0));

  return result;
}

/**
 * Build a PresenceContext resolver for a sharded Discord.js client.
 * Call this in the bot — do not use in the dashboard (no client there).
 *
 * @param {import("discord.js").Client} client - Discord.js client instance
 * @returns {{ resolver: () => Promise<import("../types/context").PresenceContext> }}
 */
function buildShardedResolver(client) {
  return {
    resolver: async () => {
      let servers;
      let members;

      if (client.shard) {
        const serverCounts = await client.shard.fetchClientValues("guilds.cache.size");
        servers = serverCounts.reduce((sum, n) => sum + n, 0);

        const memberCounts = await client.shard.broadcastEval((c) =>
          c.guilds.cache.reduce((sum, g) => sum + g.memberCount, 0)
        );
        members = memberCounts.reduce((sum, n) => sum + n, 0);
      } else {
        servers = client.guilds.cache.size;
        members = client.guilds.cache.reduce((sum, g) => sum + g.memberCount, 0);
      }

      return { servers, members };
    },
  };
}

/**
 * Build a simple PresenceContext for standalone (non-sharded) usage.
 * @param {number} servers
 * @param {number} members
 * @returns {import("../types/context").PresenceContext}
 */
function buildPresenceContext(servers, members) {
  return { servers, members };
}

module.exports = {
  applyPresencePlaceholders,
  buildShardedResolver,
  buildPresenceContext,
};
