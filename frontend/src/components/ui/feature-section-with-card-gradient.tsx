import React, { useId } from "react";

const features = [
  {
    title: "Real-Time Uptime Monitoring",
    description: "Track HTTP status and response times for all your websites every 30 seconds, 24/7.",
  },
  {
    title: "Instant Alerts",
    description: "Get notified the moment a service goes down or degrades via configurable alert rules.",
  },
  {
    title: "CI/CD Pipeline Tracking",
    description: "Monitor build and deployment pipelines stage by stage — duration, status, and failure reasons.",
  },
  {
    title: "Container Management",
    description: "Track running containers, health status, CPU/memory usage, and image versions in one view.",
  },
  {
    title: "Log Explorer",
    description: "Search and filter structured logs across all services with DEBUG, INFO, WARN, and ERROR levels.",
  },
  {
    title: "Security Monitoring",
    description: "Detect suspicious access patterns, SSL expiry warnings, and failed authentication events.",
  },
  {
    title: "Performance Analytics",
    description: "30-day response time trends, uptime percentages, and per-site performance benchmarks.",
  },
  {
    title: "Full REST API",
    description: "JWT-authenticated REST API to integrate Watchly monitoring data into your own tools and workflows.",
  },
];

export function FeaturesSectionWithCardGradient() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 rounded-3xl overflow-hidden border border-white/5 hover:border-green-500/20 transition-colors duration-300"
        >
          <Grid size={20} />
          <p className="text-base font-bold text-white relative z-20">
            {feature.title}
          </p>
          <p className="text-neutral-400 mt-4 text-sm leading-relaxed font-normal relative z-20">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-900/30 to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-white/10 stroke-white/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
