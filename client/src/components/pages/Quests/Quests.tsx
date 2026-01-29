import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";
import "./Quests.css";

interface Quest {
  _id: string;
  name: string;
  difficulty: string;
  description: string;
  status: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
}

const Quests = () => {
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    get("/api/quest/active").then((data) => setActiveQuests(data));
  }, []);

  const handleInputChange = (questId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [questId]: value }));
  };

  const handleSubmit = (questId: string) => {
    const url = inputs[questId];
    if (!url) return alert("Please paste a YouTube link first.");

    post("/api/video", { questid: questId, videourl: url })
      .then(() => {
        alert("Video submitted!");
        setActiveQuests((prev) =>
          prev.map((q) => (q._id === questId ? { ...q, status: "PENDING" } : q))
        );
      })
      .catch((err) => alert("Failed to submit: " + err.message));
  };

  return (
    <div className="quest-container">
      <h2>My Active Quests</h2>
      <ul>
        {activeQuests.map((quest) => (
          <li key={quest._id}>
            <h3>
              {quest.name} ({quest.difficulty})
            </h3>
            <p>{quest.description}</p>
            <p>
              <strong>Status:</strong> {quest.status}
            </p>

            {(quest.status === "NOT_STARTED" || quest.status === "REJECTED") && (
              <div>
                <label>
                  Video Proof (URL):{" "}
                  <input
                    type="text"
                    placeholder="Paste YouTube Link here..."
                    value={inputs[quest._id] || ""}
                    onChange={(e) => handleInputChange(quest._id, e.target.value)}
                  />
                </label>
                <button onClick={() => handleSubmit(quest._id)}>Submit Proof</button>
              </div>
            )}

            {quest.status === "PENDING" && (
              <p>
                <em>Verification in progress...</em>
              </p>
            )}
            {quest.status === "APPROVED" && <p>Complete!</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quests;
