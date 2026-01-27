import { CredentialResponse } from "@react-oauth/google";
import { Document } from "mongoose";

export interface User extends Document {
  name: string;
  username: string;
  googleid: string;
  _id: string;
  profilepicture: string;
  default: string;
  activequests: string[];
  viewed_videos: string[];
}

export interface Message {
  sender: string;
  recipient: string;
  read: boolean;
  text: string;
  _id: string;
  isGIF: boolean;
  timestamp?: Date;
}

export type AuthContext = {
  userId?: string;
  user?: User;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};

export type SidebarMode = "normal" | "notifs" | "msgs" | "hidden";

export enum SocketEvent {
  MESSAGE_RECEIVED,
  JOIN_CHAT,
}

export interface ChatOverview {
  _id: string;
  username: string;
  profilepicture: string;
  lastMessage: string;
  lastMessageIsGIF: boolean;
  timestamp: string;
  unread: number;
}

export interface SearchResult {
  _id: string;
  username: string;
  profilepicture: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Verification = "Pending" | "Approved" | "Rejected";
export interface Quest {
  _id: string;
  name: string;
  difficulty: Difficulty;
  description: string;
}

export interface Video {
  videoid: string;
  userid: string;
  verified: boolean;
  questid: string;
  videourl: string;
  _id: string;
  verification_status: Verification;
  timestamp?: Date;
}
