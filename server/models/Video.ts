import { Schema, model, version } from "mongoose";
import { Video } from "../../shared/types";
const VideoSchema = new Schema({
  userid: { type: String, required: true },
  verified: { type: Boolean, default: false },
  questid: { type: String, required: true },
  videourl: { type: String, required: true },
  verification_status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  timestamp: { type: Date, default: Date.now },
});

const VideoModel = model<Video>("Video", VideoSchema);
export default VideoModel;
