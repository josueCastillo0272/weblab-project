import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarContext from "./SidebarContext";
import SidebarNav from "./SidebarNav/SidebarNav";
import SidebarNotifications from "./SidebarNotifications";
import SidebarMessages from "./SidebarMessages/SidebarMessages";
import "./Sidebar.css";
import { SidebarMode } from "../../../../../shared/types";

const Sidebar = () => {
  const context = useContext(SidebarContext);
  const [lastActiveState, setLastActiveState] = useState<SidebarMode>("normal");
  const location = useLocation();

  useEffect(() => {
    if (!context) return;
    if (location.pathname.startsWith("/messages")) {
      if (context.state !== "msgs" && context.state !== "hidden") {
        context.setState("msgs");
      }
    } else {
      if (context.state === "msgs") {
        context.setState("normal");
      }
    }
  }, [location.pathname]);

  if (!context) return null;
  const { state, setState } = context;

  const handleToggle = () => {
    if (state === "hidden") {
      setState(lastActiveState);
    } else {
      setLastActiveState(state);
      setState("hidden");
    }
  };

  return (
    <div className={`sidebar-container ${state}`}>
      {(state === "normal" || state === "hidden") && <SidebarNav />}
      {state === "notifs" && <SidebarNotifications />}
      {state === "msgs" && <SidebarMessages />}

      <div className="sidebar-toggle" onClick={handleToggle}>
        <img
          src={`https://img.icons8.com/material-rounded/48/000000/${
            state === "hidden" ? "chevron-right" : "chevron-left"
          }.png`}
          className="sidebar-icon"
          alt="toggle"
        />
      </div>
    </div>
  );
};

export default Sidebar;
