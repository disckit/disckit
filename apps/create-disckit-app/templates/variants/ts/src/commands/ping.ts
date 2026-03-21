import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { formatTime } from "@disckit/common";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check bot latency and uptime.");

export async function execute(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
  await interaction.reply({
    embeds: [{
      color: 0x5865F2,
      title: "🏓 Pong!",
      fields: [
        { name: "Latency", value: `${Math.round(client.ws.ping)}ms`,            inline: true },
        { name: "Uptime",  value: formatTime(Math.floor((client.uptime ?? 0) / 1000)), inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  });
}
