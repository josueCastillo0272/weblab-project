import { Schema, model, Document } from "mongoose";
import { User } from "../../shared/types";
const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  googleid: String,
  profilepicture: {
    type: String,
    default: "https://www.vhv.rs/dpng/d/312-3120300_default-profile-hd-png-download.png",
  },
  bio: { type: String, default: "" },
}).index({ username: "text" });
const UserModel = model<User>("User", UserSchema);

export default UserModel;
