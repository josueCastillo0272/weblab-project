import { Message } from "../../shared/types";
import { getIo } from "../server-socket";
import { Server } from "socket.io";
export function getChatRoomId(userAId: string, userBId: string): string {
  const ret = userAId < userBId ? [userAId, userBId] : [userBId, userAId];
  return "room-" + ret.join("_");
}

export function sendMessageToRoom(recipientId: string, senderId: string, messageData: Message) {
  const chatroom: string = getChatRoomId(recipientId, senderId);
  let io: Server = getIo();

  io.to(chatroom).emit("message", messageData);
}
