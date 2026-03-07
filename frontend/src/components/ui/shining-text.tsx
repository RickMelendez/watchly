import React from "react";
import { cn } from "../../lib/utils";

interface ShiningTextProps {
  text: string;
  className?: string;
  shimmerWidth?: number;
}

export function ShiningText({ text, className, shimmerWidth = 200 }: ShiningTextProps) {
  return (
    <>
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>
      <span
        className={cn("inline-block", className)}
        style={{
          background: `linear-gradient(
            90deg,
            currentColor 0%,
            currentColor 40%,
            rgba(255,255,255,0.85) 50%,
            currentColor 60%,
            currentColor 100%
          )`,
          backgroundSize: `${shimmerWidth}% auto`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer-sweep 2.8s linear infinite",
        }}
      >
        {text}
      </span>
    </>
  );
}
