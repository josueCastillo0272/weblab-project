import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../../shared/types";
import PictureSelector from "./PictureSelector";
import { post } from "../../../utilities";
import "./Settings.css";

export default function Settings() {
  const { user } = useOutletContext<AuthContext>();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilepicture, setProfilepicture] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || "");
      setProfilepicture(user.profilepicture || "");
    }
  }, [user]);

  const handleSave = () => {
    post("/api/user/update", { username, bio, profilepicture })
      .then(() => {
        alert("Profile updated!");
        window.location.reload();
      })
      .catch((err) => alert("Failed to update: " + err.message));
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-form">
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

        <label>Profile Picture</label>
        <PictureSelector currentUrl={profilepicture} onPictureChange={setProfilepicture} />

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
