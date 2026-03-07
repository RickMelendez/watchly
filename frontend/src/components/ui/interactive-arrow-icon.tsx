import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface InteractiveArrowIconProps {
  className?: string;
  size?: number;
  color?: string;
  direction?: "right" | "up" | "down" | "left";
}

const ROTATIONS = {
  right: 0,
  up: -90,
  left: 180,
  down: 90,
};

export function InteractiveArrowIcon({
  className,
  size = 24,
  color = "currentColor",
  direction = "right",
}: InteractiveArrowIconProps) {
  const [hovered, setHovered] = useState(false);
  const rotation = ROTATIONS[direction];

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: `rotate(${rotation}deg) translateX(${hovered ? 3 : 0}px)`,
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  );
}
