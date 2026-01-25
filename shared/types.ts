import { Document } from "mongoose";
// User types

export interface User extends Document {
  name: string;
  googleid: string;
  _id: string;
  profilepicture: string;
  default: string;
}

// Message types
export interface Message {
  sender: string;
  recipient: string;
  read: boolean;
  text: string;
  _id: string;
  isGIF: boolean;
  timestamp?: Date;
}

export enum SocketEvent {
  MESSAGE_RECEIVED,
  JOIN_CHAT,
}
