import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get, post } from "../../../utilities";
import { User } from "../../../../../shared/types";
import Loading from "../Loading";
import "./Profile.css";

interface Quest {
  _id: string;
  name: string;
  difficulty: string;
}

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<string>("");

  useEffect(() => {
    if (username) {
      get(`/api/user/username/${username}`).then((userdata) => setUser(userdata));
    }
  }, [username]);

  useEffect(() => {
    get("/api/quest/pool").then((data) => {
      setQuests(data);
      if (data.length > 0) setSelectedQuest(data[0]._id);
    });
  }, []);

  const handleChallenge = () => {
    if (!user || !selectedQuest) return;

    post("/api/quest/invite", {
      recipientId: user._id,
      questId: selectedQuest,
    })
      .then(() => alert(`Challenge sent to ${user.username}!`))
      .catch((err) => alert("Failed to send challenge: " + err.message));
  };

  if (!user) return <Loading />;

  return (
    <div className="profile-container">
      <h1>{user.username}'s Profile</h1>
      <img src={user.profilepicture} alt="profile" className="profile-pic" />
      <p>
        <strong>Bio:</strong> {user.bio || "No bio yet."}
      </p>
      <hr />
      <div className="challenge-box">
        <h3>Challenge {user.username}</h3>
        <p>Pick a quest to send them:</p>
        <select value={selectedQuest} onChange={(e) => setSelectedQuest(e.target.value)}>
          {quests.map((q) => (
            <option key={q._id} value={q._id}>
              [{q.difficulty}] {q.name}
            </option>
          ))}
        </select>
        <button onClick={handleChallenge}>Send Challenge</button>
      </div>
    </div>
  );
}
