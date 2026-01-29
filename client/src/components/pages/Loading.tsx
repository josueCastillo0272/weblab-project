import React, { useState, useEffect } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const updateProgress = (currentValue: number) => {
      if (currentValue >= 100) return;

      const speed = Math.random() * 10 + 2;

      timer = setTimeout(() => {
        setProgress(currentValue + 1);
        updateProgress(currentValue + 1);
      }, speed);
    };

    updateProgress(0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "1.2rem",
        fontWeight: 200,
        color: "#b3b1b1",
        backgroundColor: "#000000",
      }}
    >
      {progress}%
    </div>
  );
}
