export interface Message {
  senderid: string;
  recipientid: string;
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
