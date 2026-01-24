import { Schema, model } from "mongoose";

export type Difficulty = "Easy" | "Medium" | "Hard";

const QuestSchema = new Schema({
  name: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
});

export interface Quest {
  _id: string;
  name: string;
  difficulty: Difficulty;
}

const QuestModel = model<Quest>("Quest", QuestSchema);

export default QuestModel;
