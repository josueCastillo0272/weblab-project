import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import SidebarContext from "./Sidebar/SidebarContext";
import { SidebarMode, AuthContext } from "../../../../shared/types";

export default function AppLayout() {
  const [sidebarState, setSidebarState] = useState<SidebarMode>("normal");
  const auth = useOutletContext<AuthContext>();
  return (
    <SidebarContext.Provider value={{ state: sidebarState, setState: setSidebarState }}>
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, position: "relative" }}>
          <Outlet context={auth} />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
