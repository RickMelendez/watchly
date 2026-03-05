import React from "react";
import { motion } from "framer-motion";

const getAccent = (title, value) => {
  const num = parseFloat(value);
  if (title === "Uptime") {
    if (num >= 99) return { color: "#22c55e", bar: "#22c55e" };
    if (num >= 90) return { color: "#f59e0b", bar: "#f59e0b" };
    return { color: "#ef4444", bar: "#ef4444" };
  }
  if (title === "Avg Response Time") {
    if (num < 200) return { color: "#22c55e", bar: "#22c55e" };
    if (num < 500) return { color: "#f59e0b", bar: "#f59e0b" };
    return { color: "#ef4444", bar: "#ef4444" };
  }
  if (title === "Active Alerts") {
    if (num === 0) return { color: "#22c55e", bar: "#22c55e" };
    if (num < 3) return { color: "#f59e0b", bar: "#f59e0b" };
    return { color: "#ef4444", bar: "#ef4444" };
  }
  return { color: "#22c55e", bar: "#22c55e" };
};

const getBarWidth = (title, value) => {
  const num = parseFloat(value);
  if (title === "Uptime") return `${Math.min(num, 100)}%`;
  if (title === "Avg Response Time") return `${Math.min((num / 1000) * 100, 100)}%`;
  if (title === "Active Alerts") return `${Math.min(num * 10, 100)}%`;
  return "100%";
};

export default function StatsGrid({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "0.75rem",
        marginBottom: "1.25rem",
      }}
    >
      {stats.map((stat, i) => {
        const accent = getAccent(stat.title, stat.value);
        const hasBar = ["Uptime", "Avg Response Time", "Active Alerts"].includes(stat.title);

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            className="stat-card"
          >
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span className="stat-card-label">{stat.title}</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: `${accent.color}15`,
                  border: `1px solid ${accent.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <stat.icon size={14} color={accent.color} strokeWidth={2.5} />
              </div>
            </div>

            {/* Value */}
            <div className="stat-card-value" style={{ color: accent.color }}>
              {stat.value}
            </div>

            {/* Bar indicator */}
            {hasBar && (
              <div
                style={{
                  marginTop: "0.875rem",
                  height: 3,
                  background: "var(--border)",
                  borderRadius: 9999,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: getBarWidth(stat.title, stat.value) }}
                  transition={{ duration: 0.8, delay: i * 0.06 + 0.2, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: accent.bar,
                    borderRadius: 9999,
                  }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
