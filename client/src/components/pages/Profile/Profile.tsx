import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { get, post } from "../../../utilities";
import { User, AuthContext } from "../../../../../shared/types";
import Loading from "../Loading";
import "./Profile.css";

interface Quest {
  _id: string;
  name: string;
  difficulty: string;
}

export default function Profile() {
  const { username } = useParams();
  const { userId: currentUserId } = useOutletContext<AuthContext>();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<string>("");

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (username) {
      get(`/api/user/username/${username}`).then((userdata) => {
        setUser(userdata);
        if (userdata) {
          // Fetch follow data
          get(`/api/follow/status/${userdata._id}`).then((res) => setIsFollowing(res.following));
          get(`/api/follow/${userdata._id}/followers`).then((res) => setFollowersCount(res.length));
          get(`/api/follow/${userdata._id}/following`).then((res) => setFollowingCount(res.length));
        }
      });
    }
  }, [username]);

  useEffect(() => {
    get("/api/quest/pool").then((data) => {
      setQuests(data);
      if (data.length > 0) setSelectedQuest(data[0]._id);
    });
  }, []);

  const handleFollowToggle = () => {
    if (!user) return;
    post("/api/follow/toggle", { followingid: user._id }).then((res) => {
      setIsFollowing(res.following);
      setFollowersCount((prev) => prev + (res.following ? 1 : -1));
    });
  };

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

      <div className="profile-stats">
        <span>
          <strong>{followersCount}</strong> Followers
        </span>
        <span>
          <strong>{followingCount}</strong> Following
        </span>
      </div>

      {currentUserId && currentUserId !== user._id && (
        <button className="profile-follow-btn" onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      <p>
        <strong>Bio:</strong> {user.bio || ""}
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
