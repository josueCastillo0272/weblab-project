import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarContext from "../SidebarContext";
import { get } from "../../../../utilities";
import { socket } from "../../../../client-socket";
import { ChatOverview } from "../../../../../../shared/types";
import "./SidebarNav.css";

const icons = [
  { name: "home", suffix: "home", path: "/home" },
  { name: "notifications", suffix: "like", path: "/home" },
  { name: "explore", suffix: "map", path: "/search" },
  { name: "friends", suffix: "conference-call", path: "/home" },
  { name: "messages", suffix: "speech-bubble", path: "/messages" },
  { name: "quests", suffix: "scroll", path: "/quests" },
  { name: "leaderboard", suffix: "trophy", path: "/leaderboard" },
  { name: "more", suffix: "menu", path: "/home" },
];

export default function SidebarNav({ overrideState }: { overrideState?: string }) {
  const context = useContext(SidebarContext);
  const [unreadTotal, setUnreadTotal] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      get("/api/overview").then((data: ChatOverview[]) => {
        const total = data.reduce((acc, curr) => acc + (curr.unread || 0), 0);
        setUnreadTotal(total);
      });
    };

    fetchUnread();
    socket.on("message", fetchUnread);
    return () => {
      socket.off("message", fetchUnread);
    };
  }, []);

  if (!context) return null;
  const { state } = context;
  const visualState = overrideState || state;

  return (
    <aside className="sidebar-root">
      <div className="sidebar-logo">{visualState !== "hidden" ? "Sidequest" : "SQ"}</div>
      <nav className="sidebar-nav">
        {icons.map((item) => (
          <Link key={item.name} to={item.path} className="sidebar-item">
            <div className="sidebar-icon-container">
              <img
                src={`https://img.icons8.com/material-rounded/48/000000/${item.suffix}.png`}
                alt={item.name}
                className="sidebar-icon"
              />
              {item.name === "messages" && unreadTotal > 0 && (
                <div className="sidebar-badge-global">{unreadTotal > 9 ? "9+" : unreadTotal}</div>
              )}
            </div>
            {visualState !== "hidden" && (
              <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
