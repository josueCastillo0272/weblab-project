import React, { useState, useEffect, useRef, useContext, useLayoutEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import { Message, AuthContext, User } from "../../../../../shared/types";
import SidebarContext from "../Sidebar/SidebarContext";
import GifPicker from "../../modules/GifPicker";
import "./Messages.css";

export default function Messages() {
  const { recipientId } = useParams();
  const { user } = useOutletContext<AuthContext>();
  const sidebarContext = useContext(SidebarContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [recipient, setRecipient] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sidebar Logic
  useEffect(() => {
    if (sidebarContext && sidebarContext.state !== "msgs") {
      sidebarContext.setState("msgs");
    }
  }, [sidebarContext]);

  // Load History, Recipient Info, and Initial Join
  useEffect(() => {
    if (recipientId && user?._id) {
      // Fetch Recipient Details
      get(`/api/user/${recipientId}`).then((u) => setRecipient(u));

      get("/api/history", { recipient: recipientId }).then((msgs) => setMessages(msgs));
      post("/api/read", { recipientid: recipientId });

      socket.emit("join-chat", { recipientId });
    }
  }, [recipientId, user?._id]);

  useEffect(() => {
    const handleConnect = () => {
      if (recipientId && user?._id) {
        console.log("Socket reconnected, re-joining room");
        socket.emit("join-chat", { recipientId });
      }
    };
    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [recipientId, user?._id]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, recipientId]);

  useEffect(() => {
    const handleMessage = (msg: Message) => {
      const uId = user?._id?.toString();
      if (
        (msg.sender === recipientId && msg.recipient === uId) ||
        (msg.sender === uId && msg.recipient === recipientId)
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

  const handleProfileClick = () => {
    if (recipient && recipient.username) {
      navigate(`/profile/${recipient.username}`);
    }
  };

  if (!recipientId) return <div className="empty-chat">Select a conversation</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        {recipient ? (
          <div className="chat-header-user" onClick={handleProfileClick}>
            <div
              className="chat-header-avatar"
              style={{ backgroundImage: `url(${recipient.profilepicture})` }}
            />
            <span className="chat-header-name">{recipient.name}</span>
          </div>
        ) : (
          <strong>Loading...</strong>
        )}
      </div>

      <div className="chat-messages-area">
        {messages.map((msg, i) => {
          const isMe = msg.sender === user?._id;
          return (
            <div
              key={msg._id || i}
              className={`message-bubble ${isMe ? "message-me" : "message-them"} ${
                msg.isGIF ? "gif-container" : "message-text"
              }`}
            >
              {msg.isGIF ? (
                <img src={msg.text} alt="GIF" className="gif-image" />
              ) : (
                <div>{msg.text}</div>
              )}
              {msg.timestamp && (
                <div className="message-timestamp">
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

      <div className="chat-input-area">
        {showGifPicker && (
          <GifPicker
            onSelect={(url) => handleSendMessage(url, true)}
            onClose={() => setShowGifPicker(false)}
          />
        )}
        <button
          className={`gif-button ${showGifPicker ? "active" : ""}`}
          onClick={() => setShowGifPicker(!showGifPicker)}
        >
          GIF
        </button>
        <input
          className="chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={() => handleSendMessage(inputText)}>
          Send
        </button>
      </div>
    </div>
  );
}
