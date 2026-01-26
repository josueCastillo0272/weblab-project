import React, { useRef, useState, useMemo, useEffect } from "react";
import gsap from "gsap";
import { Quest } from "../../../../../../shared/types";
import "./Wheel.css";

interface TypewriterProps {
  text: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const speed = 40;

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(intervalId);
    }, speed);

    return () => clearInterval(intervalId);
  }, [text]);

  return <span style={{ fontFamily: "monospace", letterSpacing: "-1px" }}>{displayedText}</span>;
};

interface WheelProps {
  quests: Quest[];
  onSpinComplete: (winningQuestId: string) => void;
  setWinnerName: (name: string) => void;
}

const WIDTH = 600;
const HEIGHT = 600;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADIUS = 300;
const TOTAL_SPINS = 8;

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

export default function Wheel({ quests, onSpinComplete, setWinnerName }: WheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelGroupRef = useRef<SVGGElement>(null);

  const sliceAngle = 360 / quests.length;

  const getColors = (difficulty: string) => {
    switch (difficulty) {
      case "Hard":
        return { fill: "#ffebee", text: "#b71c1c" };
      case "Medium":
        return { fill: "#fff3e0", text: "#e65100" };
      case "Easy":
        return { fill: "#e8f5e9", text: "#1b5e20" };
      default:
        return { fill: "#f5f5f5", text: "#000000" };
    }
  };

  const handleSpin = () => {
    if (isSpinning || !wheelGroupRef.current) return;
    setIsSpinning(true);

    const winnerIndex = Math.floor(Math.random() * quests.length);
    const selectedQuest = quests[winnerIndex];

    const targetRotation = 360 * TOTAL_SPINS - winnerIndex * sliceAngle - sliceAngle / 2;

    gsap.to(wheelGroupRef.current, {
      rotation: targetRotation,
      duration: 4.5,
      ease: "power4.out",
      transformOrigin: "center",
      onComplete: () => {
        setIsSpinning(false);
        setWinnerName(selectedQuest.name);

        setTimeout(() => {
          onSpinComplete(selectedQuest._id);
        }, 2500);
      },
    });
  };

  const slices = useMemo(() => {
    return quests.map((quest, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const colors = getColors(quest.difficulty);

      return (
        <g key={quest._id}>
          <path
            d={describeArc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle)}
            fill={colors.fill}
            stroke="#ffffff"
            strokeWidth="4"
          />
        </g>
      );
    });
  }, [quests, sliceAngle]);

  return (
    <div className="wheel-wrapper">
      <div className="wheel-pin">▼</div>

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="wheel-svg">
        <g ref={wheelGroupRef}>{slices}</g>

        <circle cx={CENTER_X} cy={CENTER_Y} r={25} fill="#000000" />
        <circle cx={CENTER_X} cy={CENTER_Y} r={8} fill="#ffffff" />
      </svg>

      <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? "..." : "SPIN"}
      </button>
    </div>
  );
}
