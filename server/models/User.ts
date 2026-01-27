import { Schema, model, Document } from "mongoose";
import { User } from "../../shared/types";
const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  googleid: String,
  profilepicture: {
    type: String,
    default:
      "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
  },
  bio: { type: String, default: "" },
  activequests: { type: [String], default: [] },
  viewed_videos: { type: [String], default: [] },
  isAdmin: { type: Boolean, default: false },
}).index({ username: "text" });
const UserModel = model<User>("User", UserSchema);

export default UserModel;
