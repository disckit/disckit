# @disckit/permissions — Documentation

## PermissionsBits

Frozen object with all Discord permission flags as `bigint` constants.

```js
PermissionsBits.ADMINISTRATOR;   // → 8n
PermissionsBits.SEND_MESSAGES;   // → 2048n
```

---

## new Permissions(input)

```js
new Permissions(8n);
new Permissions("ADMINISTRATOR");
new Permissions(["SEND_MESSAGES", "EMBED_LINKS"]);
Permissions.from(memberBitfield);
```

---

## Methods

| Method | Description |
|--------|-------------|
| `has(perms)` | ALL given perms are set. `ADMINISTRATOR` always returns `true`. |
| `any(perms)` | ANY of the given perms is set |
| `missing(perms)` | Returns names from input that are NOT set |
| `add(perms)` | Returns new instance with perms added |
| `remove(perms)` | Returns new instance with perms removed |
| `toArray()` | All set permission names as `string[]` |
| `toString()` | Bitfield as decimal string (JSON-safe) |

```js
perms.missing(["SEND_MESSAGES", "ATTACH_FILES"]); // → ["ATTACH_FILES"]
perms.any(["KICK_MEMBERS", "BAN_MEMBERS"]);        // → true/false
```
