import React, { useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { Quest } from "../../../../../../shared/types";
import "./Wheel.css";

interface WheelProps {
  quests: Quest[];
  onSpinComplete: (winningQuestId: string) => void;
}

const RADIUS = 300;
const CENTER = 300;
const TOTAL_SPINS = 5;

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "Z",
  ].join(" ");
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default function Wheel({ quests, onSpinComplete }: WheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelGroupRef = useRef<SVGGElement>(null);

  const sliceAngle = 360 / quests.length;

  const getDifficultyColor = (diff: string) => {
    if (diff === "Easy") return "#4ade80";
    if (diff === "Medium") return "#facc15";
    return "#f87171";
  };

  const handleSpin = () => {
    if (isSpinning || !wheelGroupRef.current) return;
    setIsSpinning(true);

    const winnerIndex = Math.floor(Math.random() * quests.length);
    const selectedQuest = quests[winnerIndex];

    const targetRotation = 360 * TOTAL_SPINS - winnerIndex * sliceAngle - sliceAngle / 2;

    gsap.to(wheelGroupRef.current, {
      rotation: targetRotation,
      duration: 4,
      ease: "power4.out",
      transformOrigin: "center",
      onComplete: () => {
        setIsSpinning(false);
        onSpinComplete(selectedQuest._id);
      },
    });
  };

  const slices = useMemo(() => {
    return quests.map((quest, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      return (
        <g key={quest._id}>
          <path
            d={describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle)}
            fill={getDifficultyColor(quest.difficulty)}
            stroke="white"
            strokeWidth="1"
          />
          <text
            x={CENTER}
            y={CENTER - RADIUS + 40}
            fill="black"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(${startAngle + sliceAngle / 2}, ${CENTER}, ${CENTER})`}
            style={{ pointerEvents: "none" }}
          >
            {quest.name.substring(0, 10).toUpperCase()}
          </text>
        </g>
      );
    });
  }, [quests, sliceAngle]);

  return (
    <div className="wheel-wrapper">
      <div className="wheel-pin">▼</div>

      <svg width="600" height="600" viewBox="0 0 600 600" className="wheel-svg">
        <g ref={wheelGroupRef}>{slices}</g>
        <circle cx={CENTER} cy={CENTER} r={30} fill="white" />
        <circle cx={CENTER} cy={CENTER} r={25} fill="#111" />
      </svg>

      <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? "SPINNING..." : "SPIN THE WHEEL"}
      </button>
    </div>
  );
}
