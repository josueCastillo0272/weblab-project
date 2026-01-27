import React from "react";
import { ChatOverview } from "../../../../../../shared/types";
import "./SidebarMessages.css";

interface ConversationItemProps {
  chat: ChatOverview;
  onSelect: (id: string) => void;
}

export default function ConversationItem({ chat, onSelect }: ConversationItemProps) {
  const getDisplayText = () => {
    if (chat.lastMessageIsGIF) {
      return "Sent a GIF";
    }
    const msg = chat.lastMessage;
    return msg.length > 10 ? `${msg.substring(0, 10)}...` : msg;
  };

  const getUnreadBadge = () => {
    if (chat.unread <= 0) return null;
    return <div className="sm-badge">{chat.unread > 9 ? "9+" : chat.unread}</div>;
  };

  return (
    <div className="sm-conv-item" onClick={() => onSelect(chat._id)}>
      <div className="sm-avatar-large" style={{ backgroundImage: `url(${chat.profilepicture})` }} />
      <div className="sm-conv-text">
        <div className="sm-top-row">
          <span className="sm-username">{chat.username}</span>
          {getUnreadBadge()}
        </div>
        <div
          className="sm-last-msg"
          title={chat.lastMessageIsGIF ? "Sent a GIF" : chat.lastMessage}
        >
          {getDisplayText()}
        </div>
      </div>
    </div>
  );
}
