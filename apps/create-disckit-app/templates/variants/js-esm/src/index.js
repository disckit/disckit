import "dotenv/config";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { CooldownManager }  from "@disckit/cooldown";
import { AntifloodManager, isBlocked, formatRetryAfter } from "@disckit/antiflood";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands  = new Collection();
client.cooldowns = new CooldownManager({ default: 3000 });
client.antiflood = new AntifloodManager({
  globalRule: { windowMs: 5000, maxHits: 5, penaltyMode: "NONE" },
});

// Load commands
const commandsPath = join(__dirname, "commands");
const files = (await readdir(commandsPath)).filter(f => f.endsWith(".js"));
for (const file of files) {
  const { default: cmd } = await import(join(commandsPath, file));
  if (cmd?.data && cmd?.execute) client.commands.set(cmd.data.name, cmd);
}

client.once("ready", () => console.log(`✔  Logged in as ${client.user.tag}`));

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const check = client.antiflood.check({
    userId:        interaction.user.id,
    guildId:       interaction.guildId ?? "*",
    commandName:   interaction.commandName,
    memberRoleIds: interaction.member?.roles?.cache?.map(r => r.id) ?? [],
  });

  if (isBlocked(check)) {
    return interaction.reply({
      content: `⏳ Wait **${formatRetryAfter(check.retryAfterMs)}** before using this again.`,
      ephemeral: true,
    });
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    const msg = { content: "An error occurred.", ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

if (!process.env.BOT_TOKEN) { console.error("✖  BOT_TOKEN missing in .env"); process.exit(1); }
client.login(process.env.BOT_TOKEN);
