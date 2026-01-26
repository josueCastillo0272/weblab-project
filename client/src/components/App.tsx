import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { Outlet, useNavigate } from "react-router-dom";
import { get, post } from "../utilities";
import { socket } from "../client-socket";
import { User, AuthContext } from "../../../shared/types";
import "../utilities.css";

const App = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          setUser(user);
          const finishSetup = () => {
            post("/api/initsocket", { socketid: socket.id }).then(() => {
              if (!user.username) navigate("/signup");
            });
          };

          if (socket.connected) {
            finishSetup();
          } else {
            socket.once("connect", finishSetup);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    if (!userToken) return;

    post("/api/login", { token: userToken }).then((user) => {
      setUser(user);
      post("/api/initsocket", { socketid: socket.id }).then(() => {
        if (!user.username) {
          navigate("/signup");
        } else {
          navigate("/home");
        }
      });
    });
  };

  const handleLogout = () => {
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
