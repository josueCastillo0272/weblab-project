import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar/Sidebar";
import SidebarContext from "./Sidebar/SidebarContext";
import { SidebarMode } from "../../../../shared/types";

export default function AppLayout() {
  const [sidebarState, setSidebarState] = useState<SidebarMode>("normal");
  return (
    <SidebarContext.Provider value={{ state: sidebarState, setState: setSidebarState }}>
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, position: "relative" }}>
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
