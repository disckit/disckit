import { SlashCommandBuilder } from "discord.js";
import { toDiscordTimestamp } from "@disckit/common";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Show server information."),

  async execute(interaction) {
    const { guild } = interaction;
    if (!guild) return interaction.reply({ content: "Use this in a server.", ephemeral: true });

    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        title: guild.name,
        thumbnail: guild.iconURL() ? { url: guild.iconURL() } : undefined,
        fields: [
          { name: "Members", value: `${guild.memberCount}`,               inline: true },
          { name: "Created", value: toDiscordTimestamp(guild.createdAt, "D"), inline: true },
          { name: "ID",      value: `\`${guild.id}\``,                    inline: true },
        ],
        timestamp: new Date().toISOString(),
      }],
    });
  },
};
