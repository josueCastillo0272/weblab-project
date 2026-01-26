import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../utilities";
import { socket } from "../../../client-socket";
import SidebarNav from "./SidebarNav/SidebarNav";
import SidebarContext from "./SidebarContext";
import "./Sidebar.css";

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

  useEffect(() => {
    get("/api/overview").then((data) => setConversations(data));
    const handleMsg = () => get("/api/overview").then((data) => setConversations(data));
    socket.on("message", handleMsg);
    return () => {
      socket.off("message", handleMsg);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      get("/api/chat/search", { q: query }).then((res) => setSearchResults(res));
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
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <SidebarContext.Provider value={{ state: "hidden", setState: () => {} }}>
        <div style={{ flexShrink: 0 }}>
          <SidebarNav />
        </div>
      </SidebarContext.Provider>

      <div
        className="sidebar-messages"
        style={{
          flexGrow: 1,
          borderLeft: "1px solid #333",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="sidebar-search-container" style={{ padding: "10px" }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="sidebar-search-input"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#222",
              color: "white",
            }}
          />
          {searchResults.length > 0 && (
            <div
              className="sidebar-search-results"
              style={{ background: "#222", marginTop: "5px", borderRadius: "4px" }}
            >
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${user.profilepicture})`,
                      backgroundSize: "cover",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-conversations-list" style={{ overflowY: "auto", flexGrow: 1 }}>
          {conversations.map((chat) => (
            <div
              key={chat._id}
              className="sidebar-conversation-item"
              onClick={() => handleSelectUser(chat._id)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #333",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${chat.profilepicture})`,
                  backgroundSize: "cover",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: "bold" }}>{chat.username}</div>
                <div
                  style={{
                    fontSize: "0.85em",
                    color: "#aaa",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chat.lastMessage}
                </div>
              </div>
            </div>
          ))}
          {conversations.length === 0 && searchQuery === "" && (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              No conversations yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
