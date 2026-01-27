import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  recipient: { type: String, required: true },
  type: { type: String, enum: ["LIKE", "COMMENT", "FOLLOW"], required: true },
  senders: { type: [String], required: true },
  relatedId: { type: String, default: null },
  previewText: { type: String, default: "" },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const NotificationModel = model("Notification", NotificationSchema);
export default NotificationModel;
