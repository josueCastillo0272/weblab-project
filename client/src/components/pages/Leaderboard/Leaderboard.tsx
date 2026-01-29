import React, { useState, useEffect } from "react";
import { get } from "../../../utilities";
import "./Leaderboard.css";

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
    <div className="leaderboard-container">
      <h3>Top 50 Questers</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Verified Quests</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((entry, index) => (
            <tr key={entry._id}>
              <td>{index + 1}</td>
              <td className="lb-user">
                <img src={entry.profilepicture} alt="avi" className="lb-avi" />
                {entry.username}
              </td>
              <td>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
