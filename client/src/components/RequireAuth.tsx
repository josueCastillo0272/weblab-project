import React from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import type { AuthContext } from "./App";

export default function RequireAuth() {
  const { userId } = useOutletContext<AuthContext>();
  const location = useLocation();

  if (!userId) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
