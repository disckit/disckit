# Examples — @disckit/permissions

## Check member permissions in a command

```js
const { Permissions } = require('@disckit/permissions');

// From discord.js member permissions (already a BigInt)
const perms = Permissions.from(interaction.member.permissions.bitfield);

if (!perms.has('MANAGE_GUILD')) {
  return interaction.reply({ content: 'You need Manage Server.', ephemeral: true });
}
```

## Dashboard — verify permissions without discord.js

```js
const { Permissions } = require('@disckit/permissions');

// Permissions bitfield comes from your API as a string
app.use('/admin/:guildId', (req, res, next) => {
  const memberPerms = new Permissions(BigInt(req.user.permissions));
  if (!memberPerms.has('MANAGE_GUILD')) return res.status(403).json({ error: 'Forbidden' });
  next();
});
```

## Build required permissions and check what's missing

```js
const { Permissions } = require('@disckit/permissions');

const required = new Permissions(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_ROLES']);
const member   = new Permissions(['BAN_MEMBERS', 'KICK_MEMBERS']);

const missing = required.toArray().filter(p => !member.has(p));
// → ['MANAGE_ROLES']

if (missing.length) {
  return interaction.reply(`Missing: ${missing.join(', ')}`);
}
```

## Immutable operations

```js
const base    = new Permissions(['SEND_MESSAGES', 'EMBED_LINKS']);
const updated = base.add('ATTACH_FILES');

base.has('ATTACH_FILES');    // → false  (original unchanged)
updated.has('ATTACH_FILES'); // → true
```

## TypeScript

```ts
import { Permissions, PermissionsBits, PermissionName } from '@disckit/permissions';

function requirePerms(member: { permissions: bigint }, ...required: PermissionName[]) {
  const perms   = Permissions.from(member.permissions);
  const missing = perms.missing(required);
  if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
}
```
