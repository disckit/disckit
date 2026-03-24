import { Schema, model, models, Document } from "mongoose";

export interface IExample extends Document {
  userId:    string;
  balance:   number;
  createdAt: Date;
  updatedAt: Date;
}

const exampleSchema = new Schema<IExample>(
  {
    userId:  { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Example =
  (models.Example as ReturnType<typeof model<IExample>>) ??
  model<IExample>("Example", exampleSchema);
