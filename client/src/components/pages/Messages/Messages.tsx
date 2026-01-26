import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import { Message, User, AuthContext } from "../../../../../shared/types";
import SidebarContext from "../Sidebar/SidebarContext";

export default function Messages() {
  const { recipientId } = useParams();
  const { user } = useOutletContext<AuthContext>();
  const sidebarContext = useContext(SidebarContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarContext && sidebarContext.state !== "msgs") {
      sidebarContext.setState("msgs");
    }
  }, [sidebarContext]);

  // fetch message history
  useEffect(() => {
    if (recipientId) {
      get("/api/history", { recipient: recipientId }).then((msgs) => {
        setMessages(msgs);
      });

      post("/api/read", { recipientid: recipientId });
    }
  }, [recipientId]);

  // auto-scroll bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleMessage = (msg: Message) => {
      if (
        (msg.sender === recipientId && msg.recipient === user?._id) ||
        (msg.sender === user?._id && msg.recipient === recipientId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [recipientId, user]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !recipientId) return;

    post("/api/message", { recipientid: recipientId, text: inputText }).then((msg) => {
      // setMessages((prev) => [...prev, msg]);
      setInputText("");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!recipientId) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#666",
        }}
      >
        <p>Select a conversation from the sidebar to start chatting</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid #333", background: "#1a1a1a" }}>
        <strong>Chat</strong>
      </div>
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, i) => {
          const isMe = msg.sender === user?._id;
          return (
            <div
              key={msg._id || i}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "12px",
                backgroundColor: isMe ? "#007bff" : "#333",
                color: "#fff",
                borderBottomRightRadius: isMe ? "2px" : "12px",
                borderBottomLeftRadius: isMe ? "12px" : "2px",
              }}
            >
              <div>{msg.text}</div>
              {msg.timestamp && (
                <div
                  style={{ fontSize: "0.7em", opacity: 0.7, marginTop: "4px", textAlign: "right" }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          background: "#1a1a1a",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #555",
            background: "#2a2a2a",
            color: "white",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
