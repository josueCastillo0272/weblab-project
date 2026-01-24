import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  recipientid: { type: String, required: true },
  read: { type: Boolean, default: false },
  text: { type: String, required: true },
  isGIF: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export interface Message {
  recipientid: string;
  read: boolean;
  text: string;
  _id: string;
  isGIF: boolean;
  timestamp?: Date;
}

const MessageModel = model<Message>("Message", MessageSchema);
export default MessageModel;
