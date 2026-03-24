import { Schema, model, models } from "mongoose";

const exampleSchema = new Schema(
  {
    userId:  { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Example = models.Example ?? model("Example", exampleSchema);
