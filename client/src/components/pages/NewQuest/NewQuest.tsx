import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";
import { Quest } from "../../../../../shared/types";
import Wheel from "./Wheel/Wheel";
import "./NewQuest.css";

export default function NewQuest() {
  const [questPool, setQuestPool] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get("/api/quest/pool")
      .then((data) => {
        setQuestPool(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSpinComplete = (winningQuestId: string) => {
    post("/api/quest/assign", { questid: winningQuestId }).then(() => {
      window.location.href = "/home";
    });
  };

  return (
    <div className="new-quest-container">
      {loading ? (
        <div className="loading-text">Loading...</div>
      ) : questPool.length > 0 ? (
        <Wheel quests={questPool} onSpinComplete={onSpinComplete} />
      ) : (
        <div className="error-text">NO QUESTS FOUND</div>
      )}
    </div>
  );
}
