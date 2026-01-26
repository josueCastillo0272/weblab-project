import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../../utilities";
import { socket } from "../../../../client-socket";
import { ChatOverview, SearchResult } from "../../../../../../shared/types";
import SidebarNav from "../SidebarNav/SidebarNav";
import SearchUser from "./SearchUser";
import ConversationList from "./ConversationList";
import "./SidebarMessages.css";

export default function SidebarMessages() {
  const [conversations, setConversations] = useState<ChatOverview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    get("/api/overview").then(setConversations);
    const handleMsg = () => get("/api/overview").then(setConversations);
    socket.on("message", handleMsg);
    return () => {
      socket.off("message", handleMsg);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      get("/api/chat/search", { q: e.target.value }).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    navigate(`/messages/${userId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="sm-container">
      <div className="sm-nav-wrapper">
        <SidebarNav overrideState="hidden" />
      </div>

      <div className="sm-list-container">
        <SearchUser
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSearchChange={handleSearch}
          onSelectUser={handleSelectUser}
        />
        <ConversationList
          conversations={conversations}
          searchActive={searchQuery !== ""}
          onSelectUser={handleSelectUser}
        />
      </div>
    </div>
  );
}
