import React, { useState, useEffect, useCallback } from "react";
import { Zap, AlertTriangle, Clock, Globe, RefreshCw } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getApiMonitoringSummary } from "../services/api";

const statusStyle = (s) => {
    switch (s) {
        case "healthy":  return { bg: "rgba(16,185,129,1)",  color: "#fff", label: "Healthy" };
        case "degraded": return { bg: "rgba(245,158,11,1)",  color: "#fff", label: "Degraded" };
        case "down":     return { bg: "rgba(239,68,68,1)",   color: "#fff", label: "Down" };
        default:         return { bg: "var(--bg-elevated)",  color: "var(--text-muted)", label: s };
    }
};

const fmtMs = (v) => v > 0 ? `${v}ms` : "—";

export default function ApiMonitoringPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getApiMonitoringSummary();
            setData(res.data);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const {
        total_endpoints = 0,
        avg_latency = 0,
        error_rate = 0,
        uptime_30d = 0,
        latency_distribution = [],
        endpoints = [],
    } = data || {};

    const kpiCards = [
        { title: "Total Endpoints", value: total_endpoints,        icon: Globe,          color: "#10B981" },
        { title: "Avg Latency",     value: `${avg_latency}ms`,     icon: Zap,            color: "#3B82F6" },
        { title: "Error Rate",      value: `${error_rate}%`,       icon: AlertTriangle,  color: error_rate > 1 ? "#EF4444" : "#F59E0B" },
        { title: "Uptime (30d)",    value: `${uptime_30d}%`,       icon: Clock,          color: uptime_30d >= 99 ? "#10B981" : uptime_30d >= 95 ? "#F59E0B" : "#EF4444" },
    ];

    const maxCount = latency_distribution.length > 0 ? Math.max(...latency_distribution.map(b => b.count), 1) : 1;

    return (
        <DashboardLayout pageTitle="API Monitoring" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Track endpoint performance, latency percentiles, and error rates
            </p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {kpiCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ padding: "0.625rem", borderRadius: 8, background: `${card.color}18` }}>
                                <Icon size={20} color={card.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>{card.title}</div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                    {loading ? "—" : card.value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                    <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Loading monitoring data...</p>
                </div>
            ) : total_endpoints === 0 ? (
                <div className="surface" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    No websites monitored yet. Add websites to see API monitoring stats.
                </div>
            ) : (
                <>
                    {/* Latency Distribution */}
                    <div className="surface" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Latency Distribution</h3>
                            <button className="btn-ghost" onClick={load} style={{ padding: "0.35rem 0.625rem" }}>
                                <RefreshCw size={13} />
                                Refresh
                            </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {latency_distribution.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ width: 80, fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{item.label}</div>
                                    <div style={{ flex: 1, background: "var(--bg-elevated)", height: 12, borderRadius: 999, overflow: "hidden" }}>
                                        <div style={{ width: `${(item.count / maxCount) * 100}%`, background: i === 0 ? "#10B981" : i === 1 ? "#0EA5E9" : i === 2 ? "#F59E0B" : "#EF4444", height: "100%", borderRadius: 999, transition: "width 0.3s ease" }} />
                                    </div>
                                    <div style={{ width: 110, textAlign: "right", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                        {item.count} <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>checks ({item.pct}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Endpoints Table */}
                    <div className="surface" style={{ overflow: "hidden" }}>
                        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Monitored Endpoints</h3>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Endpoint</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: "right" }}>Checks/hr</th>
                                        <th style={{ textAlign: "right" }}>p50</th>
                                        <th style={{ textAlign: "right" }}>p95</th>
                                        <th style={{ textAlign: "right" }}>p99</th>
                                        <th style={{ textAlign: "right" }}>Error %</th>
                                        <th style={{ textAlign: "right" }}>Uptime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {endpoints.map(ep => {
                                        const ss = statusStyle(ep.status);
                                        return (
                                            <tr key={ep.id}>
                                                <td>
                                                    <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.875rem" }}>{ep.name}</div>
                                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{ep.url.replace(/^https?:\/\//, "")}</div>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: 99, background: ss.bg, color: ss.color }}>
                                                        {ss.label}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{ep.checks_per_hour}</td>
                                                <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{fmtMs(ep.p50)}</td>
                                                <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: ep.p95 > 500 ? "#F59E0B" : "inherit" }}>{fmtMs(ep.p95)}</td>
                                                <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: ep.p99 > 1000 ? "#EF4444" : ep.p99 > 500 ? "#F59E0B" : "inherit" }}>{fmtMs(ep.p99)}</td>
                                                <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: ep.error_rate > 1 ? "#EF4444" : ep.error_rate > 0.5 ? "#F59E0B" : "inherit" }}>{ep.error_rate}%</td>
                                                <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: ep.uptime_pct >= 99 ? "#10B981" : ep.uptime_pct >= 95 ? "#F59E0B" : "#EF4444" }}>{ep.uptime_pct}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
