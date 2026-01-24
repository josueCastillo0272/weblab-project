import { Schema, model } from "mongoose";

const VideoSchema = new Schema({
  userid: { type: String, required: true },
  verified: { type: Boolean, default: false },
  questid: { type: String, required: true },
  videourl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export interface Video {
  videoid: string;
  userid: string;
  verified: boolean;
  questid: string;
  videourl: string;
  _id: string;
  timestamp?: Date;
}
const VideoModel = model<Video>("Vide", VideoSchema);
export default VideoModel;
