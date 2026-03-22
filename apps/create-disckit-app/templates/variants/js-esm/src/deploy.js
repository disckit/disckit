import "dotenv/config";
import { REST, Routes } from "discord.js";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const commands = [];
const files = (await readdir(join(__dirname, "commands"))).filter(f => f.endsWith(".js"));
for (const file of files) {
  const { default: cmd } = await import(join(__dirname, "commands", file));
  if (cmd?.data) commands.push(cmd.data.toJSON());
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

try {
  console.log(`Registering ${commands.length} command(s)...`);
  const guildId = process.env.TEST_GUILD_ID;
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands });
    console.log(`✔  Registered to guild ${guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log("✔  Registered globally");
  }
} catch (e) { console.error(e); }
