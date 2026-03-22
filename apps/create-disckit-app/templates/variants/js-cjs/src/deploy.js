require("dotenv").config();
const { REST, Routes } = require("discord.js");
const path = require("path");
const fs   = require("fs");

const commands = [];
for (const file of fs.readdirSync(path.join(__dirname, "commands")).filter(f => f.endsWith(".js"))) {
  const cmd = require(path.join(__dirname, "commands", file));
  if (cmd.data) commands.push(cmd.data.toJSON());
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
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
})();
