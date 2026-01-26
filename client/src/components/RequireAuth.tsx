import React from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../shared/types";

export default function RequireAuth() {
  const auth = useOutletContext<AuthContext>();
  const location = useLocation();

  if (!auth.userId) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <Outlet context={auth} />;
}
