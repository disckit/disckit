/**
 * PlaceholderEngine — Core placeholder substitution engine for Enerthya.
 *
 * Inspired by Loritta's `loritta-placeholders` module.
 * Adapted for Node.js / JavaScript.
 *
 * Key design decisions:
 *   - Zero Discord.js dependency — works with plain context objects.
 *   - Unknown/invalid placeholders are left as-is (never throws, never removes).
 *   - The bot adapts its Discord.js objects to PlaceholderContext before calling this.
 *   - The dashboard can call this directly with data from API responses (preview mode).
 */

/**
 * Replace all occurrences of a literal string token in a string.
 * @param {string} str
 * @param {string} token
 * @param {string|number} value
 * @returns {string}
 */
function replace(str, token, value) {
  return str.split(token).join(String(value ?? ""));
}

/**
 * Apply all available placeholders to a string using the given context.
 *
 * Supported placeholders:
 *   Guild:   {server}, {guild:name}, {guild:id}, {count}, {guild:memberCount}, {guild:icon}
 *   Member:  {member:id}, {member:name}, {member:nick}, {member:dis}, {member:tag},
 *            {member:mention}, {member:avatar}
 *   Inviter: {inviter:name}, {inviter:tag}, {invites}
 *   Extras:  {level}, {xp}, {rank}, {coins}
 *   Role:    {role:ID} — resolved via context.roles.resolve(id), silently removed if null
 *
 * Unknown placeholders are left unchanged.
 *
 * @param {string} content - The template string with placeholders
 * @param {import("../types/context").PlaceholderContext} context
 * @returns {string}
 */
function applyPlaceholders(content, context) {
  if (typeof content !== "string") return "";
  if (!context || typeof context !== "object") return content;

  let result = content;

  // Normalize escaped newlines
  result = result.split("\\n").join("\n");

  const { guild, member, inviter = {}, extras = {}, roles } = context;

  // ── Guild ────────────────────────────────────────────────────────────────
  if (guild) {
    result = replace(result, "{server}",            guild.name ?? "");
    result = replace(result, "{guild:name}",        guild.name ?? "");
    result = replace(result, "{guild:id}",          guild.id ?? "");
    result = replace(result, "{count}",             guild.memberCount ?? "");
    result = replace(result, "{guild:memberCount}", guild.memberCount ?? "");
    result = replace(result, "{guild:icon}",        guild.icon ?? "");
  }

  // ── Member ───────────────────────────────────────────────────────────────
  if (member) {
    result = replace(result, "{member:id}",      member.id ?? "");
    result = replace(result, "{member:name}",    member.name ?? "");
    result = replace(result, "{member:nick}",    member.nick ?? member.name ?? "");
    result = replace(result, "{member:dis}",     member.dis ?? "0");
    result = replace(result, "{member:tag}",     member.tag ?? "");
    result = replace(result, "{member:mention}", member.mention ?? "");
    result = replace(result, "{member:avatar}",  member.avatar ?? "");
  }

  // ── Inviter ──────────────────────────────────────────────────────────────
  result = replace(result, "{inviter:name}", inviter.name ?? "");
  result = replace(result, "{inviter:tag}",  inviter.tag ?? "");
  result = replace(result, "{invites}",      inviter.effectiveInvites ?? 0);

  // ── Extras ───────────────────────────────────────────────────────────────
  result = replace(result, "{level}", extras.level ?? "");
  result = replace(result, "{xp}",    extras.xp ?? "");
  result = replace(result, "{rank}",  extras.rank ?? "");
  result = replace(result, "{coins}", extras.coins ?? "");

  // ── Role — dynamic: {role:123456789} ─────────────────────────────────────
  result = result.replace(/\{role:(\d+)\}/g, (match, id) => {
    if (roles && typeof roles.resolve === "function") {
      const resolved = roles.resolve(id);
      return resolved != null ? String(resolved) : "";
    }
    // No resolver provided — leave the token as-is (preview mode)
    return match;
  });

  return result;
}

/**
 * Detect all placeholder tokens used in a string.
 * Useful for validation or showing the admin which variables are in use.
 *
 * @param {string} content
 * @returns {string[]} - Array of detected tokens, e.g. ["{member:name}", "{guild:memberCount}"]
 */
function detectPlaceholders(content) {
  if (typeof content !== "string") return [];
  const matches = content.match(/\{[^{}]+\}/g);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Check whether a string contains any placeholder tokens.
 * @param {string} content
 * @returns {boolean}
 */
function hasPlaceholders(content) {
  return detectPlaceholders(content).length > 0;
}

/**
 * Build a preview PlaceholderContext from flat data.
 * Useful in the dashboard to create a context for live preview
 * without needing Discord.js objects.
 *
 * @param {{
 *   guildName?: string,
 *   guildId?: string,
 *   memberCount?: number,
 *   guildIcon?: string,
 *   memberId?: string,
 *   memberName?: string,
 *   memberNick?: string,
 *   memberTag?: string,
 *   memberAvatar?: string,
 *   inviterName?: string,
 *   inviterTag?: string,
 *   effectiveInvites?: number,
 *   level?: number,
 *   xp?: number,
 *   rank?: number,
 *   coins?: number,
 * }} flat
 * @returns {import("../types/context").PlaceholderContext}
 */
function buildPreviewContext(flat = {}) {
  const memberId = flat.memberId ?? "000000000000000001";
  return {
    guild: {
      name: flat.guildName ?? "My Server",
      id: flat.guildId ?? "000000000000000000",
      memberCount: flat.memberCount ?? 100,
      icon: flat.guildIcon ?? "",
    },
    member: {
      id: memberId,
      name: flat.memberName ?? "member",
      nick: flat.memberNick ?? flat.memberName ?? "member",
      dis: "0",
      tag: flat.memberTag ?? `${flat.memberName ?? "member"}#0`,
      mention: `<@${memberId}>`,
      avatar: flat.memberAvatar ?? "",
    },
    inviter: {
      name: flat.inviterName ?? "",
      tag: flat.inviterTag ?? "",
      effectiveInvites: flat.effectiveInvites ?? 0,
    },
    extras: {
      level: flat.level ?? "",
      xp: flat.xp ?? "",
      rank: flat.rank ?? "",
      coins: flat.coins ?? "",
    },
  };
}

/**
 * Apply eventlog placeholders to a string.
 *
 * @param {string} content
 * @param {{
 *   user?: { id?: string, name?: string, mention?: string, avatar?: string },
 *   channel?: { id?: string, mention?: string },
 *   guild?: { name?: string, memberCount?: number },
 *   action?: string,
 *   before?: string,
 *   after?: string,
 *   reason?: string,
 *   moderator?: string,
 *   accountAge?: string,
 * }} ctx
 * @returns {string}
 */
function applyEventlogPlaceholders(content, ctx = {}) {
  if (typeof content !== "string") return "";
  let r = content;

  const u = ctx.user ?? {};
  const c = ctx.channel ?? {};
  const g = ctx.guild ?? {};

  r = replace(r, "{user}",              u.name      ?? "");
  r = replace(r, "{user:mention}",      u.mention   ?? "");
  r = replace(r, "{user:id}",           u.id        ?? "");
  r = replace(r, "{user:avatar}",       u.avatar    ?? "");
  r = replace(r, "{channel}",           c.mention   ?? "");
  r = replace(r, "{channel:id}",        c.id        ?? "");
  r = replace(r, "{guild:name}",        g.name      ?? "");
  r = replace(r, "{guild:memberCount}", g.memberCount ?? "");
  r = replace(r, "{action}",            ctx.action  ?? "");
  r = replace(r, "{before}",            ctx.before  ?? "");
  r = replace(r, "{after}",             ctx.after   ?? "");
  r = replace(r, "{reason}",            ctx.reason  ?? "");
  r = replace(r, "{moderator}",         ctx.moderator ?? "");
  r = replace(r, "{account:age}",       ctx.accountAge ?? "");

  return r;
}

/**
 * Apply forms DM confirmation placeholders.
 * @param {string} content
 * @param {{ formName?: string, formId?: number, userName?: string, userMention?: string }} ctx
 * @returns {string}
 */
function applyFormPlaceholders(content, ctx = {}) {
  if (typeof content !== "string") return "";
  let r = content;
  r = replace(r, "{form:name}",   ctx.formName    ?? "");
  r = replace(r, "{form:id}",     ctx.formId      ?? "");
  r = replace(r, "{user}",        ctx.userName    ?? "");
  r = replace(r, "{user:mention}", ctx.userMention ?? "");
  return r;
}

/**
 * Apply counter channel name placeholders.
 * @param {string} content
 * @param {{ all?: number, members?: number, bots?: number }} ctx
 * @returns {string}
 */
function applyCounterPlaceholders(content, ctx = {}) {
  if (typeof content !== "string") return "";
  let r = content;
  r = replace(r, "{all}",     ctx.all     ?? "");
  r = replace(r, "{members}", ctx.members ?? "");
  r = replace(r, "{bots}",    ctx.bots    ?? "");
  return r;
}

module.exports = {
  applyPlaceholders,
  applyEventlogPlaceholders,
  applyFormPlaceholders,
  applyCounterPlaceholders,
  detectPlaceholders,
  hasPlaceholders,
  buildPreviewContext,
};
