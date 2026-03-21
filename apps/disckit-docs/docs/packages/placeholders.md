# @disckit/placeholders

Placeholder engine for Discord bot messages and embeds. Powers welcome messages, farewell messages, and bot status strings. No discord.js dependency — works in bots, REST APIs, and dashboards.

```sh
npm install @disckit/placeholders
```

[![npm](https://img.shields.io/npm/v/@disckit/placeholders?style=flat-square&color=ff468a)](https://www.npmjs.com/package/@disckit/placeholders)

## Quick start

```js
const { applyPlaceholders, createContext } = require("@disckit/placeholders");

const context = createContext({
  guild:  { name: "My Server", id: "123", memberCount: 250, icon: "https://..." },
  member: { id: "456", name: "Alice", nick: "ali", discriminator: "0", mention: "<@456>", avatar: "https://..." },
});

applyPlaceholders("Welcome to **{guild:name}**, {member:mention}! You are member #{count}.", context);
// "Welcome to **My Server**, <@456>! You are member #250."
```

## Available placeholders

### Guild

| Placeholder | Description |
|-------------|-------------|
| `{server}` | Server name (alias for `{guild:name}`) |
| `{guild:name}` | Server name |
| `{guild:id}` | Server ID |
| `{count}` | Member count (alias for `{guild:memberCount}`) |
| `{guild:memberCount}` | Member count |
| `{guild:icon}` | Server icon URL |

### Member

| Placeholder | Description |
|-------------|-------------|
| `{member:id}` | Member user ID |
| `{member:name}` | Member username |
| `{member:nick}` | Member nickname (falls back to username if not set) |
| `{member:dis}` | Member discriminator |
| `{member:tag}` | `username#discriminator` |
| `{member:mention}` | `<@id>` mention |
| `{member:avatar}` | Member avatar URL |

### Inviter

| Placeholder | Description |
|-------------|-------------|
| `{inviter:name}` | Inviter username |
| `{inviter:tag}` | `username#discriminator` of the inviter |
| `{invites}` | Total invites from the inviter |

### Extras

| Placeholder | Description |
|-------------|-------------|
| `{level}` | Member level |
| `{xp}` | Member XP |
| `{rank}` | Member rank |
| `{coins}` | Member coins |

### Roles

| Placeholder | Description |
|-------------|-------------|
| `{role:ID}` | Resolved role mention for the given ID. Silently removed if not found. |

### Special

- `\n` in the template string is converted to an actual newline.
- Unknown placeholders are left unchanged (never throws).

## API

### `applyPlaceholders(content, context)`

Applies all placeholders to `content` using the given context. Unknown placeholders are left as-is.

```js
applyPlaceholders("{member:mention} joined {guild:name}!", context);
```

### `createContext(data)`

Helper to build a `PlaceholderContext` object from plain data. All fields are optional.

```js
const context = createContext({
  guild:  { name, id, memberCount, icon },
  member: { id, name, nick, discriminator, mention, avatar },
  inviter: { name, tag },
  extras:  { invites, level, xp, rank, coins },
  roles:   { resolve: (id) => guild.roles.cache.get(id) ?? null },
});
```

### `PlaceholderContext` (type)

```ts
interface PlaceholderContext {
  guild?:   { name?: string; id?: string; memberCount?: number; icon?: string };
  member?:  { id?: string; name?: string; nick?: string; discriminator?: string; mention?: string; avatar?: string };
  inviter?: { name?: string; tag?: string };
  extras?:  { invites?: number; level?: number; xp?: number; rank?: number; coins?: number };
  roles?:   { resolve: (id: string) => { toString(): string } | null };
}
```

## Examples

### Welcome message

```js
const { applyPlaceholders, createContext } = require("@disckit/placeholders");

client.on("guildMemberAdd", async (member) => {
  const config = await getGuildConfig(member.guild.id);
  if (!config.welcome?.enabled || !config.welcome.channel) return;

  const context = createContext({
    guild:  { name: member.guild.name, id: member.guild.id, memberCount: member.guild.memberCount },
    member: { id: member.id, name: member.user.username, nick: member.nickname, mention: `<@${member.id}>` },
  });

  const message = applyPlaceholders(config.welcome.message, context);
  const channel = member.guild.channels.cache.get(config.welcome.channel);
  await channel?.send(message);
});
```

### Dashboard preview (no Discord.js)

```js
// In a React dashboard — preview how a message will look
const { applyPlaceholders, createContext } = require("@disckit/placeholders");

function previewMessage(template, guildData, memberData) {
  const context = createContext({ guild: guildData, member: memberData });
  return applyPlaceholders(template, context);
}
```
