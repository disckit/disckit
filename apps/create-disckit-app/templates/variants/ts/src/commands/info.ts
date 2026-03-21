import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { toDiscordTimestamp } from "@disckit/common";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Show server information.");

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const { guild } = interaction;
  if (!guild) return void interaction.reply({ content: "Use this in a server.", ephemeral: true });

  await interaction.reply({
    embeds: [{
      color: 0x5865F2,
      title: guild.name,
      thumbnail: guild.iconURL() ? { url: guild.iconURL()! } : undefined,
      fields: [
        { name: "Members", value: `${guild.memberCount}`,                   inline: true },
        { name: "Created", value: toDiscordTimestamp(guild.createdAt, "D"), inline: true },
        { name: "ID",      value: `\`${guild.id}\``,                        inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  });
}
