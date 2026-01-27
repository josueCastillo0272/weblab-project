import React, { useState, useEffect } from "react";
import { get } from "../../../utilities";

interface LeaderboardEntry {
  _id: string;
  count: number;
  username: string;
  profilepicture: string;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    get("/api/user/leaderboard").then((data) => {
      setLeaders(data);
    });
  }, []);

  return (
    <div>
      <h3>Leaderboard</h3>
      <ul>
        {leaders.map((entry, index) => (
          <li key={entry._id}>
            {index + 1}. {entry.username} - {entry.count} verified quests
          </li>
        ))}
      </ul>
    </div>
  );
}
