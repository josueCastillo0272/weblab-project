import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { get, post } from "../../../utilities";
import { Quest } from "../../../../../shared/types";
import Wheel, { Typewriter } from "./Wheel/Wheel";
import CoinDrop from "./CoinDrop";
import "./NewQuest.css";

export default function NewQuest() {
  const [questPool, setQuestPool] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [winningName, setWinningName] = useState<string | null>(null);

  useEffect(() => {
    get("/api/quest/pool")
      .then((data: Quest[]) => {
        setQuestPool(data);
      })
      .catch((err: unknown) => console.error("Failed to load quests", err))
      .finally(() => setLoading(false));
  }, []);

  const onSpinComplete = (winningQuestId: string) => {
    post("/api/quest/assign", { questid: winningQuestId }).then(() => {
      window.location.href = "/home";
    });
  };

  const handleLanded = useCallback(() => {
    setHasLanded(true);
  }, []);

  return (
    <div className="new-quest-container">
      <div className={`canvas-layer ${hasLanded ? "fade-out" : ""}`}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <CoinDrop onLanded={handleLanded} />
          </Suspense>
        </Canvas>
      </div>

      <div className={`ui-layer ${hasLanded ? "fade-in" : "hidden"}`}>
        <div className="winner-display">{winningName && <Typewriter text={winningName} />}</div>

        {loading ? (
          <div className="loading-text">INITIALIZING...</div>
        ) : questPool.length > 0 ? (
          <Wheel
            quests={questPool}
            onSpinComplete={onSpinComplete}
            setWinnerName={setWinningName}
          />
        ) : (
          <div className="error-text">NO QUESTS AVAILABLE</div>
        )}
      </div>
    </div>
  );
}
