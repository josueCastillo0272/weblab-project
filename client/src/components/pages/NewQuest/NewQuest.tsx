import React, { useState } from "react";
import { get, post } from "../../../utilities";
import { Quest } from "../../../../../shared/types";
import "./NewQuest.css";

export default function NewQuest() {
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);

  const handleSelectNewQuest = () => {
    get("/api/quest/pool").then((pool: Quest[]) => {
      if (pool.length > 0) {
        const random = pool[Math.floor(Math.random() * pool.length)];
        setGeneratedQuest(random);
      }
    });
  };

  const handleAccept = () => {
    if (!generatedQuest) return;
    post("/api/quest/assign", { questid: generatedQuest._id }).then(() => {
      alert("Quest Accepted!");
      setGeneratedQuest(null);
    });
  };

  return (
    <div className="new-quest-container">
      <div className="new-quest-overlay">
        {!generatedQuest ? (
          <button className="select-quest-btn" onClick={handleSelectNewQuest}>
            Select New Quest
          </button>
        ) : (
          <div className="quest-card-display">
            <h2>{generatedQuest.name}</h2>
            <span className={`difficulty-badge ${generatedQuest.difficulty.toLowerCase()}`}>
              {generatedQuest.difficulty}
            </span>
            <p>{generatedQuest.description}</p>
            <div className="quest-actions">
              <button onClick={handleAccept}>Accept</button>
              <button className="secondary" onClick={() => setGeneratedQuest(null)}>
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
