import { Schema, model } from "mongoose";
import { Quest } from "../../shared/types";
const QuestSchema = new Schema({
  name: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
});

const QuestModel = model<Quest>("Quest", QuestSchema);

export default QuestModel;
