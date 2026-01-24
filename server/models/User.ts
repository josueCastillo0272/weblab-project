import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  username: String,
  googleid: String,
  profilepicture: {type: String, default: "default"}, // Imgur link
  bio: {type: String, default: ""}
});

export interface User extends Document {
  name: string;
  googleid: string;
  _id: string;
  profilepicture: string
  default: string
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
