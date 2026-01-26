import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import { Message, AuthContext } from "../../../../../shared/types";
import SidebarContext from "../Sidebar/SidebarContext";
import GifPicker from "../../modules/GifPicker";

export default function Messages() {
  const { recipientId } = useParams();
  const { user } = useOutletContext<AuthContext>();
  const sidebarContext = useContext(SidebarContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarContext && sidebarContext.state !== "msgs") {
      sidebarContext.setState("msgs");
    }
  }, [sidebarContext]);

  useEffect(() => {
    if (recipientId && user?._id) {
      get("/api/history", { recipient: recipientId }).then((msgs) => setMessages(msgs));
      post("/api/read", { recipientid: recipientId });
      socket.emit("join-chat", { recipientId });
    }
  }, [recipientId, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleSendMessage = (text: string, isGIF: boolean = false) => {
    if (!recipientId) return;
    if (!isGIF && !text.trim()) return;

    post("/api/message", { recipientid: recipientId, text, isGIF }).then(() => {
      if (!isGIF) setInputText("");
      setShowGifPicker(false);
    });
  };

  if (!recipientId)
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
        Select a conversation
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
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
              {msg.isGIF ? (
                <img
                  src={msg.text}
                  alt="GIF"
                  style={{ width: "150px", height: "auto", borderRadius: "8px", display: "block" }}
                />
              ) : (
                <div>{msg.text}</div>
              )}
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
          alignItems: "center",
        }}
      >
        {showGifPicker && (
          <GifPicker
            onSelect={(url) => handleSendMessage(url, true)}
            onClose={() => setShowGifPicker(false)}
          />
        )}
        <button
          onClick={() => setShowGifPicker(!showGifPicker)}
          style={{
            background: showGifPicker ? "#444" : "transparent",
            border: "1px solid #555",
            color: "white",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          GIF
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
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
          onClick={() => handleSendMessage(inputText)}
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
