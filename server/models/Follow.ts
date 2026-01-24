import { Schema, model } from "mongoose";

const FollowSchema = new Schema({
  followerid: { type: String, required: true },
  followingid: { type: String, required: true },
});

export interface Follow {
  followerid: string;
  followingid: string;
  _id: string;
}

const FollowModel = model<Follow>("Follow", FollowSchema);
export default FollowModel;
