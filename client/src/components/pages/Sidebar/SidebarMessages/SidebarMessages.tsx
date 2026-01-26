import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../../utilities";
import { socket } from "../../../../client-socket";
import SidebarNav from "../SidebarNav/SidebarNav";
import "./SidebarMessages.css";

interface ChatOverview {
  _id: string;
  username: string;
  profilepicture: string;
  lastMessage: string;
  timestamp: string;
}

interface SearchResult {
  _id: string;
  username: string;
  profilepicture: string;
}

export default function SidebarMessages() {
  const [conversations, setConversations] = useState<ChatOverview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  // Messages Bar
  useEffect(() => {
    get("/api/overview").then(setConversations);
    const handleMsg = () => get("/api/overview").then(setConversations);
    socket.on("message", handleMsg);
    return () => {
      socket.off("message", handleMsg);
    };
  }, []);
  // Search for person w/ autofill
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      get("/api/chat/search", { q: e.target.value }).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  };
  // Select person and get rid of autofill button.
  const handleSelectUser = (userId: string) => {
    navigate(`/messages/${userId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="sm-container">
      <div className="sm-nav-wrapper">
        {/* Same "state" as sidebar when hidden*/}
        <SidebarNav overrideState="hidden" />
      </div>

      <div className="sm-list-container">
        <div className="sm-search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="sm-input"
          />
          {searchResults.length > 0 && (
            <div className="sm-results">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  className="sm-result-item"
                >
                  <div
                    className="sm-avatar-small"
                    style={{ backgroundImage: `url(${user.profilepicture})` }}
                  />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sm-list-scroll">
          {conversations.map((chat) => (
            <div key={chat._id} className="sm-conv-item" onClick={() => handleSelectUser(chat._id)}>
              <div
                className="sm-avatar-large"
                style={{ backgroundImage: `url(${chat.profilepicture})` }}
              />
              <div className="sm-conv-text">
                <div className="sm-username">{chat.username}</div>
                <div className="sm-last-msg">{chat.lastMessage}</div>
              </div>
            </div>
          ))}
          {conversations.length === 0 && searchQuery === "" && (
            <div className="sm-empty">No conversations yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
