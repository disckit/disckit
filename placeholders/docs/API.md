# API Reference — @disckit/placeholders

## `applyPlaceholders(content, context)` → `string`

Applies all available placeholders to a string.

Unknown tokens are left as-is — never throws, never removes unrecognized placeholders.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `content` | `string` | Template string with `{token}` placeholders |
| `context` | `PlaceholderContext` | Context object with guild, member, inviter, extras, roles |

---

## `buildPreviewContext(flat?)` → `PlaceholderContext`

Builds a realistic preview context from flat data. Useful for dashboard live previews.

```ts
buildPreviewContext({
  guildName?: string;   guildId?: string;     memberCount?: number;  guildIcon?: string;
  memberId?: string;    memberName?: string;   memberNick?: string;   memberTag?: string;
  memberAvatar?: string;
  inviterName?: string; inviterTag?: string;   effectiveInvites?: number;
  level?: number;       xp?: number;           rank?: number;         coins?: number;
})
```

---

## `detectPlaceholders(content)` → `string[]`

Returns all unique `{token}` patterns found in the string.

## `hasPlaceholders(content)` → `boolean`

Returns `true` if any placeholder tokens are found.

---

## `applyPresencePlaceholders(message, context)` → `Promise<string>`

Replaces `{servers}` and `{members}` in a bot status string.

**context** can be:
- `{ servers: number, members: number }` — direct values
- `{ resolver: async () => { servers, members } }` — async resolver (for sharded bots)

## `buildPresenceContext(servers, members)` → `PresenceContext`

Creates a simple presence context from raw counts.

---

## `VARIABLES` — variable registry

Array of `VariableDefinition` objects:

```ts
{ key: string; group: string; description: string; example: string }
```

## `getByGroup(group)` → `VariableDefinition[]`

Filter variables by group: `"guild"` · `"member"` · `"inviter"` · `"extras"` · `"role"` · `"presence"`

## `getAllKeys()` → `string[]`

All variable keys as a flat array.

## `findByKey(key)` → `VariableDefinition | undefined`

Find a variable definition by its exact key string.

---

## `PlaceholderContext`

```ts
{
  guild?: {
    name?: string; id?: string; memberCount?: number; icon?: string;
  };
  member?: {
    id?: string; name?: string; nick?: string; dis?: string;
    tag?: string; mention?: string; avatar?: string;
  };
  inviter?: { name?: string; tag?: string; effectiveInvites?: number; };
  extras?:  { level?: number|string; xp?: number|string; rank?: number|string; coins?: number|string; };
  roles?:   { resolve(roleId: string): string | null; };
}
```
