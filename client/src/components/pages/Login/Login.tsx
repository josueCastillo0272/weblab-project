import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate, useOutletContext } from "react-router-dom";
import type { AuthContext } from "../../App";

export default function Login() {
  const { handleLogin, userId } = useOutletContext<AuthContext>();

  if (userId) return <Navigate to="/home" replace />;

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => {
        console.log("Error logging in");
      }}
    />
  );
}
