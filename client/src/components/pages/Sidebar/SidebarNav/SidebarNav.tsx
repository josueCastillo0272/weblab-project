import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SidebarContext from "../SidebarContext";
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

export default function SidebarNav() {
  const context = useContext(SidebarContext);
  if (!context) return null;
  const { state } = context;

  return (
    <aside className="sidebar-root">
      <div className="sidebar-logo">{state !== "hidden" ? "Sidequest" : "SQ"}</div>
      <nav className="sidebar-nav">
        {icons.map((item) => (
          <Link key={item.name} to={item.path} className="sidebar-item">
            <img
              src={`https://img.icons8.com/material-rounded/48/000000/${item.suffix}.png`}
              alt={item.name}
              className="sidebar-icon"
            />
            <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
