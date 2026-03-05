import React, { useState } from "react";
import { ExternalLinkIcon, TrashIcon, AlertTriangleIcon } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const formatUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const StatusBadge = ({ isDown, responseTime }) => {
  const rt = parseFloat(responseTime);
  if (isDown) {
    return <span className="badge-down"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} /> Down</span>;
  }
  if (!isNaN(rt) && rt > 500) {
    return <span className="badge-slow"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} /> Slow</span>;
  }
  return <span className="badge-online"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} /> Online</span>;
};

const ResponseCell = ({ value }) => {
  if (!value || value === "N/A") return <span style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>—</span>;
  const num = parseFloat(value);
  const color = num > 500 ? "#ef4444" : num > 200 ? "#f59e0b" : "#22c55e";
  return <span style={{ fontFamily: "JetBrains Mono, monospace", color, fontSize: "0.8125rem" }}>{num.toFixed(0)} <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>ms</span></span>;
};

const UptimeCell = ({ value }) => {
  const num = parseFloat(value);
  const color = isNaN(num) ? "var(--text-muted)" : num >= 99 ? "#22c55e" : num >= 90 ? "#f59e0b" : "#ef4444";
  return <span style={{ fontFamily: "JetBrains Mono, monospace", color, fontSize: "0.8125rem" }}>{isNaN(num) ? "—" : `${num.toFixed(1)}%`}</span>;
};

export default function WebsitesTable({ websites, removeWebsite }) {
  const { showToast } = useToast();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRemove = (id, name) => {
    removeWebsite(id);
    if (showToast) showToast({ title: "Removed", description: `${name} removed from monitoring.` });
  };

  if (websites.length === 0) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-muted)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <AlertTriangleIcon size={32} color="var(--text-muted)" />
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
          No websites monitored yet
        </p>
        <p style={{ margin: 0, fontSize: "0.8125rem" }}>
          Add your first website above to start monitoring.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Website</th>
            <th>Status</th>
            <th>Uptime</th>
            <th>Response Time</th>
            <th>Frequency</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {websites.map((site, i) => (
            <React.Fragment key={site.id || i}>
              <tr
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                style={{ cursor: "pointer", transition: "background 0.1s" }}
              >
                {/* # */}
                <td>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </td>

                {/* Website */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: site.isDown ? "#ef4444" : "#22c55e",
                          boxShadow: site.isDown ? "0 0 6px #ef4444" : "0 0 6px #22c55e",
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.8125rem" }}>
                        {formatUrl(site.url)}
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                        {site.url}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td><StatusBadge isDown={site.isDown} responseTime={site.response_time} /></td>

                {/* Uptime */}
                <td><UptimeCell value={site.uptime} /></td>

                {/* Response Time */}
                <td><ResponseCell value={site.response_time} /></td>

                {/* Frequency */}
                <td>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {site.frequency ? `${site.frequency}s` : "60s"}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end", opacity: hoveredRow === i ? 1 : 0, transition: "opacity 0.15s" }}>
                    <button
                      className="btn-ghost"
                      style={{ padding: "0.3rem 0.45rem" }}
                      title="Open website"
                      onClick={(e) => { e.stopPropagation(); window.open(site.url, "_blank"); }}
                    >
                      <ExternalLinkIcon size={13} />
                    </button>
                    <button
                      className="btn-ghost"
                      style={{ padding: "0.3rem 0.45rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                      title="Remove"
                      onClick={(e) => { e.stopPropagation(); handleRemove(site.id, formatUrl(site.url)); }}
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Expanded detail row */}
              {expandedRow === i && (
                <tr>
                  <td colSpan={7} style={{ padding: "0.75rem 1rem 1rem", background: "var(--bg-elevated)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                      {[
                        {
                          label: "MONITORING",
                          rows: [
                            ["Check every", site.frequency ? `${site.frequency}s` : "60s"],
                            ["Added", new Date().toLocaleDateString()],
                            ["Last check", new Date().toLocaleTimeString()],
                          ],
                        },
                        {
                          label: "PERFORMANCE",
                          rows: [
                            ["Uptime", site.uptime || "—"],
                            ["Avg response", site.response_time !== "N/A" ? `${parseFloat(site.response_time || 0).toFixed(0)}ms` : "—"],
                            ["Status", site.isDown ? "Down" : "Up"],
                          ],
                        },
                        {
                          label: "ALERTS",
                          rows: [
                            ["Email", "Enabled"],
                            ["SMS", "Disabled"],
                            ["Slack", "—"],
                          ],
                        },
                      ].map(({ label, rows }) => (
                        <div key={label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.75rem" }}>
                          <div style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{label}</div>
                          {rows.map(([k, v]) => (
                            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{k}</span>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}