# Examples — @disckit/placeholders

## Welcome message in a Discord bot

```js
const { applyPlaceholders } = require('@disckit/placeholders');

// Build context from Discord.js objects
function buildContext(member, inviteData = {}) {
  return {
    guild: {
      name: member.guild.name,
      id: member.guild.id,
      memberCount: member.guild.memberCount,
      icon: member.guild.iconURL() ?? '',
    },
    member: {
      id:      member.id,
      name:    member.user.username,
      nick:    member.displayName,
      dis:     member.user.discriminator,
      tag:     member.user.tag,
      mention: member.toString(),
      avatar:  member.displayAvatarURL(),
    },
    inviter: inviteData,
    roles: {
      resolve: id => member.guild.roles.cache.get(id)?.toString() ?? null,
    },
  };
}

client.on('guildMemberAdd', async member => {
  const settings = await getSettings(member.guild.id);
  if (!settings.welcome?.enabled) return;

  const ctx     = buildContext(member);
  const message = applyPlaceholders(settings.welcome.message, ctx);
  await welcomeChannel.send(message);
});
```

## Dashboard live preview

```js
const { applyPlaceholders, buildPreviewContext } = require('@disckit/placeholders');

app.post('/api/preview', (req, res) => {
  const { template, guildName, memberCount } = req.body;
  const ctx = buildPreviewContext({ guildName, memberCount, memberName: 'preview_user' });
  res.json({ result: applyPlaceholders(template, ctx) });
});
```

## Validate a template before saving

```js
const { detectPlaceholders, VARIABLES } = require('@disckit/placeholders');

const validKeys = new Set(VARIABLES.map(v => v.key));
const used      = detectPlaceholders(template);
const unknown   = used.filter(k => !validKeys.has(k));

if (unknown.length) {
  return res.status(400).json({ error: `Unknown placeholders: ${unknown.join(', ')}` });
}
```
