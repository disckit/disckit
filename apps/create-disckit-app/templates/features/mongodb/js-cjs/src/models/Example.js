const { Schema, model, models } = require("mongoose");

const exampleSchema = new Schema(
  {
    userId:  { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = models.Example ?? model("Example", exampleSchema);
