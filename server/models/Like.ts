import { Schema, model } from "mongoose";

const LikeSchema = new Schema({
  videoid: { type: String, required: true },
  likecount: { type: Number, default: 0 },
});

export interface Like {
  videoid: string;
  _id: string;
  likecount: number;
}

const LikeModel = model<Like>("Like", LikeSchema);

export default LikeModel;
