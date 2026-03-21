# @disckit/permissions

Human-readable Discord permission bitfields. Wrap, check, combine and diff permission values without needing discord.js.

```sh
npm install @disckit/permissions
```

[![npm](https://img.shields.io/npm/v/@disckit/permissions?style=flat-square&color=ff468a)](https://www.npmjs.com/package/@disckit/permissions)

## Quick start

```js
const { Permissions } = require("@disckit/permissions");

// From permission names
const perms = new Permissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"]);

perms.has("SEND_MESSAGES");       // true
perms.has("ADMINISTRATOR");       // false
perms.any(["BAN_MEMBERS", "KICK_MEMBERS"]); // false

// From a raw bitfield (e.g. from Discord API)
const fromApi = new Permissions(277025770560n);
fromApi.toArray(); // ["VIEW_CHANNEL", "SEND_MESSAGES", ...]

// ADMINISTRATOR bypasses all checks
const admin = new Permissions("ADMINISTRATOR");
admin.has("BAN_MEMBERS"); // true
admin.any(["MANAGE_GUILD"]); // true
```

## Constructor

```js
new Permissions(input?)
```

| Input type | Example | Description |
|------------|---------|-------------|
| `bigint` | `277025770560n` | Raw permission bitfield from the Discord API |
| `number` | `8` | Same as bigint but auto-converted |
| `string` | `"ADMINISTRATOR"` | Single permission name |
| `string[]` | `["BAN_MEMBERS", "KICK_MEMBERS"]` | Array of permission names |
| _(none)_ | `new Permissions()` | Empty bitfield — no permissions |

## Methods

### Checks

| Method | Returns | Description |
|--------|---------|-------------|
| `has(perms)` | `boolean` | Returns `true` if **all** given permissions are set. `ADMINISTRATOR` always returns `true`. |
| `any(perms)` | `boolean` | Returns `true` if **any** given permission is set. `ADMINISTRATOR` always returns `true`. |
| `missing(perms)` | `string[]` | Returns the permission names in `perms` that are **not** set. |

### Mutation

Permissions instances are **immutable** — these methods return new instances.

| Method | Returns | Description |
|--------|---------|-------------|
| `add(perms)` | `Permissions` | Returns a new instance with the given permissions added. |
| `remove(perms)` | `Permissions` | Returns a new instance with the given permissions removed. |
| `diff(other)` | `{ added: string[], removed: string[] }` | Returns which permissions were added or removed relative to `other`. |

### Output

| Method | Returns | Description |
|--------|---------|-------------|
| `toArray()` | `string[]` | Returns all set permission names. Does **not** expand `ADMINISTRATOR`. |
| `toString()` | `string` | Returns the bitfield as a decimal string. Safe for JSON. |
| `toJSON()` | `string` | Same as `toString()`. |
| `bitfield` | `bigint` | The raw bigint bitfield. |

### Static

| Method | Returns | Description |
|--------|---------|-------------|
| `Permissions.from(bitfield)` | `Permissions` | Alias for `new Permissions(bitfield)`. |
| `Permissions.resolve(names)` | `bigint` | Resolves an array of permission names to a raw bigint. |

## Permission names

All standard Discord permission names are supported:

```
ADMINISTRATOR          CREATE_INSTANT_INVITE   KICK_MEMBERS
BAN_MEMBERS            MANAGE_CHANNELS         MANAGE_GUILD
ADD_REACTIONS          VIEW_AUDIT_LOG          PRIORITY_SPEAKER
STREAM                 VIEW_CHANNEL            SEND_MESSAGES
SEND_TTS_MESSAGES      MANAGE_MESSAGES         EMBED_LINKS
ATTACH_FILES           READ_MESSAGE_HISTORY    MENTION_EVERYONE
USE_EXTERNAL_EMOJIS    VIEW_GUILD_INSIGHTS     CONNECT
SPEAK                  MUTE_MEMBERS            DEAFEN_MEMBERS
MOVE_MEMBERS           USE_VAD                 CHANGE_NICKNAME
MANAGE_NICKNAMES       MANAGE_ROLES            MANAGE_WEBHOOKS
MANAGE_EMOJIS_AND_STICKERS  USE_APPLICATION_COMMANDS  REQUEST_TO_SPEAK
MANAGE_EVENTS          MANAGE_THREADS          CREATE_PUBLIC_THREADS
CREATE_PRIVATE_THREADS USE_EXTERNAL_STICKERS   SEND_MESSAGES_IN_THREADS
USE_EMBEDDED_ACTIVITIES  MODERATE_MEMBERS
```

## Examples

### Check bot permissions before a command

```js
const { Permissions } = require("@disckit/permissions");

async function execute(interaction) {
  const botPerms = new Permissions(interaction.guild.members.me.permissions.bitfield);
  const required = ["BAN_MEMBERS", "SEND_MESSAGES"];
  const absent   = botPerms.missing(required);

  if (absent.length > 0) {
    return interaction.reply({
      content: `Missing permissions: ${absent.join(", ")}`,
      ephemeral: true,
    });
  }

  // proceed...
}
```

### Diff permissions on role update

```js
client.on("guildRoleUpdate", (before, after) => {
  const prev = new Permissions(before.permissions.bitfield);
  const curr = new Permissions(after.permissions.bitfield);
  const { added, removed } = curr.diff(prev);

  if (added.length)   console.log("Permissions added:",   added);
  if (removed.length) console.log("Permissions removed:", removed);
});
```

### Combine and serialize

```js
const base  = new Permissions(["VIEW_CHANNEL", "SEND_MESSAGES"]);
const extra = base.add(["EMBED_LINKS", "ATTACH_FILES"]);

// Safe for storing in a database
const stored = extra.toString(); // "274877910016"

// Restore later
const restored = new Permissions(BigInt(stored));
```
