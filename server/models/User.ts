import { Schema, model, Document } from "mongoose";
import { User } from "../../shared/types";
const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  googleid: String,
  profilepicture: { type: String, default: "default" }, // Imgur link
  bio: { type: String, default: "" },
}).index({ username: "text" });
const UserModel = model<User>("User", UserSchema);

export default UserModel;
