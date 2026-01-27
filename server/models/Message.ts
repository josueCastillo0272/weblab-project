import { Schema, model } from "mongoose";
import { Message } from "../../shared/types";

const ReactionSchema = new Schema({
  emoji: { type: String, required: true },
  userIds: { type: [String], default: [] },
});

const MessageSchema = new Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  read: { type: Boolean, default: false },
  text: { type: String, required: true },
  isGIF: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },
  reactions: { type: [ReactionSchema], default: [] },
}).index({ sender: 1, recipient: 1 });
const MessageModel = model<Message>("Message", MessageSchema);
export default MessageModel;
