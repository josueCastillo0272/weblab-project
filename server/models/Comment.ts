import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
  videoid: { type: String, required: true, ref: "Video" },
  userid: { type: String, required: true, ref: "User" },
  parentid: { type: String, required: false, default: null, ref: "Comment" },
  text: { type: String, required: true },

  timestamp: { type: Date, default: Date.now },
});

export interface Comment {
  commentid: string;
  videoid: string;
  userid: string;
  parentid?: string | null; // optional
  _id: string;
  timestamp?: Date;
}
const CommentModel = model<Comment>("Comment", CommentSchema);
export default CommentModel;
