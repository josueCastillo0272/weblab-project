import { Schema, model } from "mongoose";

const LikeSchema = new Schema({
  parentid: { type: String, required: true },
  userid: { type: String, required: true },
});

export interface Like {
  parentid: string;
  userid: string;
  _id: string;
}

const LikeModel = model<Like>("Like", LikeSchema);
export default LikeModel;
