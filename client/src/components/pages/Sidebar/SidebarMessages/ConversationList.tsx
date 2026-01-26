import React from "react";
import { ChatOverview } from "../../../../../../shared/types";
import ConversationItem from "./ConversationItem";
import "./SidebarMessages.css";

interface ConversationListProps {
  conversations: ChatOverview[];
  searchActive: boolean;
  onSelectUser: (id: string) => void;
}

export default function ConversationList({
  conversations,
  searchActive,
  onSelectUser,
}: ConversationListProps) {
  return (
    <div className="sm-list-scroll">
      {conversations.map((chat) => (
        <ConversationItem key={chat._id} chat={chat} onSelect={onSelectUser} />
      ))}
      {conversations.length === 0 && !searchActive && (
        <div className="sm-empty">No conversations yet.</div>
      )}
    </div>
  );
}
