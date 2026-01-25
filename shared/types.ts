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
