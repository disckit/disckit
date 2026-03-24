import mongoose from "mongoose";

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Call this once before client.login().
 */
export async function connectDatabase(): Promise<void> {
  if (!process.env.MONGO_URI) {
    console.error("✖  MONGO_URI missing in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✔  MongoDB connected");
}
