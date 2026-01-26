import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { post } from "../../../utilities";
import { AuthContext } from "../../../../../shared/types";
import PictureSelector from "../Settings/PictureSelector";
import { Navigate } from "react-router-dom";
export default function Signup() {
  const { user } = useOutletContext<AuthContext>();
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState(user?.profilepicture || "");

  if (!user) return <Navigate to="/login" replace />;

  const completeSetup = () => {
    post("/api/user/update", { username, profilepicture: pfp }).then(() => {
      window.location.href = "/home";
    });
  };

  return (
    <div className="signup-root">
      <h2>Complete your SideQuest Profile</h2>
      <PictureSelector onPictureChange={setPfp} currentUrl={pfp} />
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={completeSetup} disabled={!username}>
        Start Exploring
      </button>
    </div>
  );
}
