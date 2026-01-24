import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar/Sidebar";

export default function AppLayout() {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}
