import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import { Outlet, useNavigate } from "react-router-dom";
import { get, post } from "../utilities";
import { socket } from "../client-socket";
import { User } from "../../../shared/types";
import "../utilities.css";
import { AuthContext } from "../../../shared/types";
const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          setUserId(user._id);
          setUser(user);
          if (!user.username) navigate("/signup");
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };

    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setUser(user);
      post("/api/initsocket", { socketid: socket.id });
      if (!user.username) {
        navigate("/signup");
      } else {
        navigate("/home");
      }
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    setUser(undefined);
    post("/api/logout");
  };

  const authContextValue: AuthContext = {
    userId: user?._id,
    user,
    handleLogin,
    handleLogout,
  };
  if (loading) return null;

  return <Outlet context={authContextValue} />;
};

export default App;
