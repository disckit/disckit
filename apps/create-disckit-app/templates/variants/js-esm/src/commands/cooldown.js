import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("cooldown")
    .setDescription("Demo command with a 10 second cooldown per user."),

  async execute(interaction, client) {
    const key = { userId: interaction.user.id, commandName: "cooldown" };
    const remaining = client.cooldowns.remaining(key);

    if (remaining > 0) {
      const secs = (remaining / 1000).toFixed(1);
      return interaction.reply({
        content: `⏳ You're on cooldown. Try again in **${secs}s**.`,
        ephemeral: true,
      });
    }

    client.cooldowns.consume(key, 10_000);

    await interaction.reply({
      embeds: [{
        color: 0xff468a,
        title: "✅ Command executed",
        description: "This command has a **10 second** cooldown per user.",
        footer: { text: "Try running it again right now." },
      }],
    });
  },
};
