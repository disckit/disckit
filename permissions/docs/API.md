# API Reference — @disckit/permissions

## `class Permissions`

Wraps a Discord permission bitfield in a clean, readable API. No discord.js required.

### Constructor

```ts
new Permissions(input?: bigint | number | PermissionName | PermissionName[])
```

Accepts: raw `bigint`/`number` bitfield, a single permission name string, or an array of names.

Throws `TypeError` for unsupported types, `RangeError` for unknown permission names.

### `has(perms)` → `boolean`

Returns `true` if ALL given permissions are set. `ADMINISTRATOR` always returns `true`.

### `any(perms)` → `boolean`

Returns `true` if ANY of the given permissions are set. `ADMINISTRATOR` always returns `true`.

### `missing(perms)` → `PermissionName[]`

Returns permission names in `perms` that are NOT set in this bitfield.

### `add(perms)` → `Permissions`

Returns a **new** Permissions instance with the given permissions added. Original is unchanged.

### `remove(perms)` → `Permissions`

Returns a **new** Permissions instance with the given permissions removed. Original is unchanged.

### `toArray()` → `PermissionName[]`

Returns all set permission names. Does NOT expand `ADMINISTRATOR` — only lists explicitly set bits.

### `toString()` → `string`

Returns the bitfield as a decimal string. Safe for JSON serialization.

### `bitfield` (property)

The raw `bigint` permission bitfield.

### `Permissions.from(input)` — static

Alias for `new Permissions(input)`.

### `Permissions.resolve(input)` — static

Resolves any `PermissionResolvable` to a raw `bigint`. Useful for low-level operations.

---

## `PermissionsBits`

Frozen object with all 50 Discord permission flags as named `bigint` constants.

```ts
PermissionsBits.ADMINISTRATOR          // 8n
PermissionsBits.BAN_MEMBERS            // 4n
PermissionsBits.KICK_MEMBERS           // 2n
PermissionsBits.MANAGE_GUILD           // 32n
PermissionsBits.SEND_MESSAGES          // 2048n
PermissionsBits.MODERATE_MEMBERS       // 1099511627776n
// ... all 50 flags
```

---

## All permission names

`CREATE_INSTANT_INVITE` · `KICK_MEMBERS` · `BAN_MEMBERS` · `ADMINISTRATOR` · `MANAGE_CHANNELS` · `MANAGE_GUILD` · `ADD_REACTIONS` · `VIEW_AUDIT_LOG` · `PRIORITY_SPEAKER` · `STREAM` · `VIEW_CHANNEL` · `SEND_MESSAGES` · `SEND_TTS_MESSAGES` · `MANAGE_MESSAGES` · `EMBED_LINKS` · `ATTACH_FILES` · `READ_MESSAGE_HISTORY` · `MENTION_EVERYONE` · `USE_EXTERNAL_EMOJIS` · `VIEW_GUILD_INSIGHTS` · `CONNECT` · `SPEAK` · `MUTE_MEMBERS` · `DEAFEN_MEMBERS` · `MOVE_MEMBERS` · `USE_VAD` · `CHANGE_NICKNAME` · `MANAGE_NICKNAMES` · `MANAGE_ROLES` · `MANAGE_WEBHOOKS` · `MANAGE_GUILD_EXPRESSIONS` · `USE_APPLICATION_COMMANDS` · `REQUEST_TO_SPEAK` · `MANAGE_EVENTS` · `MANAGE_THREADS` · `CREATE_PUBLIC_THREADS` · `CREATE_PRIVATE_THREADS` · `USE_EXTERNAL_STICKERS` · `SEND_MESSAGES_IN_THREADS` · `USE_EMBEDDED_ACTIVITIES` · `MODERATE_MEMBERS` · `VIEW_CREATOR_MONETIZATION_ANALYTICS` · `USE_SOUNDBOARD` · `CREATE_GUILD_EXPRESSIONS` · `CREATE_EVENTS` · `USE_EXTERNAL_SOUNDS` · `SEND_VOICE_MESSAGES` · `SEND_POLLS` · `USE_EXTERNAL_APPS`
