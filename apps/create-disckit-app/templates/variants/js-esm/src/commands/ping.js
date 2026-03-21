import { SlashCommandBuilder } from "discord.js";
import { formatTime } from "@disckit/common";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency and uptime."),

  async execute(interaction, client) {
    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        title: "🏓 Pong!",
        fields: [
          { name: "Latency", value: `${Math.round(client.ws.ping)}ms`,            inline: true },
          { name: "Uptime",  value: formatTime(Math.floor(client.uptime / 1000)), inline: true },
        ],
        timestamp: new Date().toISOString(),
      }],
    });
  },
};
