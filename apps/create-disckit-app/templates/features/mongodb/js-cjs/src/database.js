const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Call this once before client.login().
 */
async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.error("✖  MONGO_URI missing in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✔  MongoDB connected");
}

module.exports = { connectDatabase };
