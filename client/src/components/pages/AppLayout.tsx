import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar/Sidebar";
import SidebarContext from "./Sidebar/SidebarContext";
import { SidebarMode } from "../../types";

export default function AppLayout() {
  const [sidebarState, setSidebarState] = useState<SidebarMode>("normal");
  return (
    <SidebarContext.Provider value={{ state: sidebarState, setState: setSidebarState }}>
      <div>
        <Sidebar />
        <Outlet />
      </div>
    </SidebarContext.Provider>
  );
}
