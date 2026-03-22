import "dotenv/config";
import { Client, Collection, GatewayIntentBits, Interaction } from "discord.js";
import { CooldownManager }  from "@disckit/cooldown";
import { AntifloodManager, isBlocked, formatRetryAfter } from "@disckit/antiflood";
import path from "path";
import fs   from "fs";

interface BotCommand {
  data: { name: string; toJSON(): unknown };
  execute(interaction: Interaction, client: BotClient): Promise<void>;
}

interface BotClient extends Client {
  commands:  Collection<string, BotCommand>;
  cooldowns: CooldownManager;
  antiflood: AntifloodManager;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as BotClient;

client.commands  = new Collection();
client.cooldowns = new CooldownManager({ default: 3000 });
client.antiflood = new AntifloodManager({
  globalRule: { windowMs: 5000, maxHits: 5, penaltyMode: "NONE" },
});

// Load commands
const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"))) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cmd: BotCommand = require(path.join(commandsPath, file));
  if (cmd.data && cmd.execute) client.commands.set(cmd.data.name, cmd);
}

client.once("ready", () => console.log(`✔  Logged in as ${client.user?.tag}`));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const check = client.antiflood.check({
    userId:        interaction.user.id,
    guildId:       interaction.guildId ?? "*",
    commandName:   interaction.commandName,
    memberRoleIds: interaction.member?.roles
      ? Array.from((interaction.member.roles as { cache: Map<string, unknown> }).cache.keys())
      : [],
  });

  if (isBlocked(check)) {
    return void interaction.reply({
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
