# @disckit/embed

Fluent Discord embed builder with presets and pagination — no discord.js required.

## Installation

```sh
npm install @disckit/embed
```

## Features

- **Fluent API** — chainable methods with full Discord limit validation
- **Presets** — `success`, `error`, `warning`, `info`, `loading` one-liners
- **Pagination** — split any array into embed pages via `EmbedBuilder.paginate()`
- **TypeScript** — complete type definitions included
- **Zero dependencies** — works in bots, dashboards and plain REST clients

## Basic Usage

```js
const { EmbedBuilder } = require("@disckit/embed");

const embed = new EmbedBuilder()
  .setTitle("Server Info")
  .setDescription("Here are your server details.")
  .setColor("#5865F2")
  .addField("Members", "1,234", true)
  .addField("Channels", "56", true)
  .setTimestamp()
  .toJSON();

await interaction.reply({ embeds: [embed] });
```

## Presets

Ready-made embeds for common use cases:

```js
const { presets } = require("@disckit/embed");

await interaction.reply({ embeds: [presets.success("Action completed!").toJSON()] });
await interaction.reply({ embeds: [presets.error("Something went wrong.").toJSON()] });
await interaction.reply({ embeds: [presets.warning("Proceed with caution.").toJSON()] });
await interaction.reply({ embeds: [presets.info("Here is some info.").toJSON()] });
await interaction.reply({ embeds: [presets.loading("Fetching data…").toJSON()] });
```

| Preset | Color |
|--------|-------|
| `success` | `#57F287` — green |
| `error` | `#ED4245` — red |
| `warning` | `#FEE75C` — yellow |
| `info` | `#5865F2` — blurple |
| `loading` | `#99AAB5` — grey |

## Pagination

Split any array into multiple embed pages:

```js
const { EmbedBuilder } = require("@disckit/embed");

const bans = await guild.bans.fetch();
const pages = EmbedBuilder.paginate([...bans.values()], {
  title: "Ban List",
  color: "#ED4245",
  itemsPerPage: 10,
  format: (ban, i) => `${i + 1}. **${ban.user.tag}** — ${ban.reason ?? "No reason"}`,
});

// pages[0].toJSON(), pages[1].toJSON(), ...
```

## TypeScript

```ts
import { EmbedBuilder, type RawEmbed } from "@disckit/embed";

function buildEmbed(title: string): RawEmbed {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor("#5865F2")
    .setTimestamp()
    .toJSON();
}
```

## API Reference

### Setters

| Method | Description |
|--------|-------------|
| `.setTitle(title)` | Title — max 256 chars |
| `.setDescription(text)` | Description — max 4096 chars |
| `.setColor(color)` | Hex string `"#5865F2"` or decimal |
| `.setURL(url)` | Makes title clickable |
| `.setTimestamp(date?)` | Timestamp (defaults to now) |
| `.setThumbnail(url)` | Small corner image |
| `.setImage(url)` | Large bottom image |
| `.setAuthor({ name, iconURL?, url? })` | Author section |
| `.setFooter({ text, iconURL? })` | Footer text |

### Fields

| Method | Description |
|--------|-------------|
| `.addField(name, value, inline?)` | Add a field (max 25 total) |
| `.addFields(fields[])` | Add multiple fields at once |
| `.setFields(fields[])` | Replace all fields |
| `.spliceField(index)` | Remove a field by index |

### Output & Utilities

| Method | Description |
|--------|-------------|
| `.toJSON()` | Returns Discord API-compatible object |
| `.clone()` | Deep copy of the builder |
| `.isEmpty()` | `true` if no title, description or fields are set |
| `EmbedBuilder.paginate(items, opts)` | Split array into embed pages |

### Limits

```js
const { LIMITS } = require("@disckit/embed");

LIMITS.TITLE        // 256
LIMITS.DESCRIPTION  // 4096
LIMITS.FIELDS       // 25
LIMITS.FIELD_NAME   // 256
LIMITS.FIELD_VALUE  // 1024
LIMITS.FOOTER       // 2048
LIMITS.AUTHOR       // 256
```
