import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { get } from "../../../utilities";
import { socket } from "../../../client-socket";
import "./Sidebar.css";

interface ChatOverview {
  _id: string;
  username: string;
  profilepicture: string;
  lastmessage: string;
  timestamp: string;
}

interface SearchResult {
  _id: string;
  username: string;
  profilepicture: string;
}

export default function SidebarMessages() {
  const [conv, setConv] = useState<ChatOverview[]>([]);
  const [searchquery, setSearchQuery] = useState("");
  const [searchres, setSearchRes] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  // recent convos
  useEffect(() => {
    get("/api/overview").then((data) => {
      setConv(data);
    });
  }, []);

  // incoming msgs
  useEffect(() => {
    //refetch
    const handleMsg = (msg: any) => {
      get("/api/overview").then((data) => {
        setConv(data);
      });
    };

    socket.on("message", handleMsg);
    return () => {
      socket.off("message", handleMsg);
    };
  }, []);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      get("/api/chat/search", { q: query }).then((res) => setSearchRes(res));
    }
  };

  const handleSelectUser = (username: string) => {
    navigate(`/messages/${username}`);
    setSearchQuery("");
    setSearchRes([]);
  };

  return (
    <div className="sidebar-messages">
      <div className="sidebar-search-container" style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="New message..."
          value={searchquery}
          onChange={handleSearch}
          className="sidebar-search-input"
          style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        {searchres.length > 0 && (
          <div
            className="sidebar-search-results"
            style={{ background: "#222", marginTop: "5px", borderRadius: "4px" }}
          >
            {searchres.map((user) => (
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

      <div
        className="sidebar-conversations-list"
        style={{ overflowY: "auto", height: "calc(100% - 60px)" }}
      >
        {conv.map((chat) => (
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
                {chat.lastmessage}
              </div>
            </div>
          </div>
        ))}
        {conv.length === 0 && searchquery === "" && (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );
}
