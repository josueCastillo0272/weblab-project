import { Schema, model } from "mongoose";
import { Message } from "../../shared/types";
const MessageSchema = new Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  read: { type: Boolean, default: false },
  text: { type: String, required: true },
  isGIF: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = model<Message>("Message", MessageSchema);
export default MessageModel;
