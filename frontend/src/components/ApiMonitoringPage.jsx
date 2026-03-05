import React from "react";
import { Zap, AlertTriangle, Clock, Globe } from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const ApiMonitoringPage = () => {
    // Hardcoded mock data to perfectly match the "API Monitoring / Analytics" Signal Dashboard aesthetic

    const summaryCards = [
        { title: "Total Endpoints", value: "48", icon: Globe, color: "#10B981" },
        { title: "Avg Latency", value: "142ms", icon: Zap, color: "#3B82F6" },
        { title: "Error Rate", value: "0.24%", icon: AlertTriangle, color: "#F59E0B" },
        { title: "Uptime (30d)", value: "99.98%", icon: Clock, color: "#10B981" },
    ];

    const distribution = [
        { label: "< 50ms", count: 28, color: "#10B981", width: "65%" },
        { label: "50-200ms", count: 12, color: "#0EA5E9", width: "35%" },
        { label: "200-500ms", count: 5, color: "#F59E0B", width: "15%" },
        { label: "500ms-1s", count: 2, color: "#EF4444", width: "8%" },
        { label: "> 1s", count: 1, color: "#EF4444", width: "5%" },
    ];

    const endpoints = [
        { method: "GET", path: "/api/v2/servers", service: "infra-api", status: "Healthy", rpm: "2,450", p50: "12ms", p95: "45ms", p99: "128ms", error: "0.02%" },
        { method: "POST", path: "/api/v2/deployments", service: "deploy-api", status: "Healthy", rpm: "340", p50: "89ms", p95: "234ms", p99: "512ms", error: "0.08%" },
        { method: "GET", path: "/api/v2/metrics", service: "metrics-api", status: "Healthy", rpm: "8,900", p50: "5ms", p95: "18ms", p99: "42ms", error: "0.01%" },
        { method: "POST", path: "/api/v2/incidents", service: "incident-api", status: "Healthy", rpm: "120", p50: "67ms", p95: "189ms", p99: "345ms", error: "0.12%" },
        { method: "GET", path: "/api/v2/logs/search", service: "log-api", status: "Degraded", rpm: "4,200", p50: "34ms", p95: "320ms", p99: "1.2s", error: "1.04%" },
    ];

    return (
        <DashboardLayout pageTitle="API Monitoring">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Track endpoint performance, latency percentiles, and error rates
            </p>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {summaryCards.map((card, i) => (
                    <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ padding: "0.625rem", borderRadius: "8px", background: `rgba(${card.color === '#10B981' ? '16,185,129' : card.color === '#3B82F6' ? '59,130,246' : '245,158,11'}, 0.1)` }}>
                            <card.icon size={20} color={card.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>
                                {card.title}
                            </div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                {card.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Latency Distribution */}
            <div className="surface" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>Latency Distribution</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {distribution.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: "80px", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                {item.label}
                            </div>
                            <div style={{ flex: 1, background: "var(--bg-elevated)", height: "12px", borderRadius: "999px", overflow: "hidden" }}>
                                <div style={{ width: item.width, background: item.color, height: "100%", borderRadius: "999px" }} />
                            </div>
                            <div style={{ width: "80px", textAlign: "right", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                {item.count} <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>endpoints</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Endpoints Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Endpoints</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Endpoint</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>RPM</th>
                                <th style={{ textAlign: "right" }}>p50</th>
                                <th style={{ textAlign: "right" }}>p95</th>
                                <th style={{ textAlign: "right" }}>p99</th>
                                <th style={{ textAlign: "right" }}>Error %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {endpoints.map((ep, i) => (
                                <tr key={i}>
                                    <td style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{
                                            fontSize: "0.6rem", fontWeight: 700, padding: "0.2rem 0.4rem", borderRadius: "4px",
                                            background: ep.method === "GET" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                                            color: ep.method === "GET" ? "#10B981" : "#3B82F6",
                                            fontFamily: "JetBrains Mono, monospace"
                                        }}>
                                            {ep.method}
                                        </span>
                                        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>{ep.path}</span>
                                    </td>
                                    <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{ep.service}</td>
                                    <td>
                                        <span style={{
                                            fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "99px",
                                            background: ep.status === "Healthy" ? "rgba(16,185,129,1)" : "rgba(245,158,11,1)",
                                            color: "#fff"
                                        }}>
                                            {ep.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{ep.rpm} <span style={{ color: "#10B981" }}>↗</span></td>
                                    <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{ep.p50}</td>
                                    <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{ep.p95}</td>
                                    <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: ep.p99.includes("s") && !ep.p99.includes("ms") ? "#F59E0B" : "inherit" }}>
                                        {ep.p99}
                                    </td>
                                    <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: parseFloat(ep.error) > 1 ? "#EF4444" : "inherit" }}>
                                        {ep.error}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApiMonitoringPage;
