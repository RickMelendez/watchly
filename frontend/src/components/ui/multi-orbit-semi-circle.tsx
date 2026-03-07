import React from "react";
import { cn } from "../../lib/utils";

interface OrbitItem {
  icon: React.ReactNode;
  label?: string;
}

interface MultiOrbitSemiCircleProps {
  items: OrbitItem[];
  center?: React.ReactNode;
  className?: string;
  radius?: number;
}

export function MultiOrbitSemiCircle({
  items,
  center,
  className,
  radius = 120,
}: MultiOrbitSemiCircleProps) {
  const count = items.length;
  // Spread icons across the top semi-circle (180° arc, from -180° to 0°)
  const startAngle = -180;
  const endAngle = 0;
  const step = count > 1 ? (endAngle - startAngle) / (count - 1) : 0;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: radius * 2 + 60, height: radius + 60 }}
    >
      {/* Semi-circle arc */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={radius * 2 + 60}
        height={radius + 60}
        style={{ overflow: "visible" }}
      >
        <path
          d={`M ${30} ${radius + 30} A ${radius} ${radius} 0 0 1 ${radius * 2 + 30} ${radius + 30}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Center element */}
      {center && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          {center}
        </div>
      )}

      {/* Orbit items */}
      {items.map((item, i) => {
        const angleDeg = startAngle + i * step;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = radius + 30 + radius * Math.cos(angleRad);
        const y = radius + 30 + radius * Math.sin(angleRad);

        return (
          <div
            key={i}
            className="absolute flex flex-col items-center gap-1"
            style={{ left: x - 20, top: y - 20 }}
            title={item.label}
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg hover:border-white/20 hover:scale-110 transition-all duration-200 cursor-default">
              {item.icon}
            </div>
            {item.label && (
              <span className="text-xs text-neutral-500 whitespace-nowrap">{item.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
