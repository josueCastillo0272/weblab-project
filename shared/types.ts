import { CredentialResponse } from "@react-oauth/google";
import { Document } from "mongoose";
// User types

export interface User extends Document {
  name: string;
  username: string;
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
// auth-related
export type AuthContext = {
  userId?: string;
  user?: User;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};

//sidebar-related
export type SidebarMode = "normal" | "notifs" | "msgs" | "hidden";

export enum SocketEvent {
  MESSAGE_RECEIVED,
  JOIN_CHAT,
}
