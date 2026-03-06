import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import api, { updateAlert } from "../services/api";

const getSeverity = (alert_type = "") => {
    const t = alert_type.toLowerCase();
    if (t.includes("down") || t.includes("offline") || t.includes("critical")) {
        return { label: "Critical", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" };
    }
    if (t.includes("slow") || t.includes("timeout") || t.includes("high")) {
        return { label: "Warning", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" };
    }
    return { label: "Info", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" };
};

const timeAgo = (ts) => {
    if (!ts) return "—";
    const normalized = typeof ts === "string" && !ts.endsWith("Z") && !ts.includes("+") ? ts + "Z" : ts;
    const diff = Math.floor((Date.now() - new Date(normalized)) / 1000);
    if (diff < 0) return "just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export default function IncidentsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState({});
    const [filter, setFilter] = useState("active");

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/alerts");
            setAlerts(res.data || []);
        } catch {
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
        const id = setInterval(fetchAlerts, 30000);
        return () => clearInterval(id);
    }, [fetchAlerts]);

    const handleResolve = async (alertId) => {
        setResolving(p => ({ ...p, [alertId]: true }));
        try {
            await updateAlert(alertId, "resolved");
            setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "resolved" } : a));
        } catch { }
        finally {
            setResolving(p => ({ ...p, [alertId]: false }));
        }
    };

    const activeCount = alerts.filter(a => a.status !== "resolved").length;
    const resolvedCount = alerts.filter(a => a.status === "resolved").length;

    const filtered = alerts.filter(a => {
        if (filter === "active") return a.status !== "resolved";
        if (filter === "resolved") return a.status === "resolved";
        return true;
    });

    const kpiCards = [
        { title: "Active Incidents", value: activeCount, color: activeCount > 0 ? "#EF4444" : "#10B981" },
        { title: "Resolved", value: resolvedCount, color: "#10B981" },
        { title: "Total", value: alerts.length, color: "#3B82F6" },
    ];

    return (
        <DashboardLayout pageTitle="Incidents" alertCount={activeCount} onRefresh={fetchAlerts}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Active and historical service incidents across all monitored websites.
            </p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {kpiCards.map((c, i) => (
                    <div key={i} className="surface" style={{ padding: "1.25rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.4rem" }}>{c.title}</div>
                        <div style={{ fontSize: "2rem", fontWeight: 700, color: c.color, fontFamily: "JetBrains Mono, monospace" }}>{c.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter + Refresh */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                    {[
                        { key: "active", label: "Active", count: activeCount },
                        { key: "resolved", label: "Resolved" },
                        { key: "all", label: "All" },
                    ].map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            style={{
                                padding: "0.35rem 0.75rem", borderRadius: 6, border: "1px solid",
                                fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                                background: filter === key ? "rgba(34,197,94,0.1)" : "var(--bg-surface)",
                                color: filter === key ? "#22c55e" : "var(--text-secondary)",
                                borderColor: filter === key ? "rgba(34,197,94,0.3)" : "var(--border)",
                            }}
                        >
                            {label}
                            {count > 0 && (
                                <span style={{ marginLeft: "0.375rem", background: "#ef4444", color: "#fff", borderRadius: "9999px", padding: "0.05rem 0.35rem", fontSize: "0.65rem", fontWeight: 700 }}>
                                    {count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <button className="btn-ghost" onClick={fetchAlerts} disabled={loading} style={{ padding: "0.35rem 0.625rem" }}>
                    <RefreshCw size={13} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
                    Refresh
                </button>
            </div>

            {/* Incidents List */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertTriangle size={14} color="#F59E0B" />
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Incident Log</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "0.1rem 0.4rem", borderRadius: 4 }}>
                        {filtered.length}
                    </span>
                </div>

                {loading ? (
                    <div style={{ padding: "3rem", textAlign: "center" }}>
                        <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }} />
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Loading incidents...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                        <CheckCircle size={32} color="#22c55e" />
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                            {filter === "active" ? "No active incidents" : "No incidents found"}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                            {filter === "active" ? "All systems are running smoothly." : "No incident history to display."}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {filtered.map((alert, i) => {
                            const sev = getSeverity(alert.alert_type);
                            const isResolved = alert.status === "resolved";
                            return (
                                <div key={alert.id} style={{
                                    display: "flex", alignItems: "center", gap: "1rem",
                                    padding: "1rem 1.25rem",
                                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                                }}>
                                    {/* Severity icon */}
                                    <div style={{ background: isResolved ? "rgba(34,197,94,0.1)" : sev.bg, padding: "0.5rem", borderRadius: 8, flexShrink: 0 }}>
                                        {isResolved
                                            ? <CheckCircle size={16} color="#22c55e" />
                                            : <XCircle size={16} color={sev.color} />
                                        }
                                    </div>

                                    {/* Main info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                                            <span style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                                                {alert.website_name || `Site #${alert.website_id}`}
                                            </span>
                                            <span style={{
                                                padding: "0.1rem 0.45rem", borderRadius: 9999, fontSize: "0.65rem", fontWeight: 700,
                                                background: isResolved ? "rgba(34,197,94,0.1)" : sev.bg,
                                                color: isResolved ? "#22c55e" : sev.color,
                                                border: `1px solid ${isResolved ? "rgba(34,197,94,0.2)" : sev.border}`,
                                            }}>
                                                {isResolved ? "Resolved" : sev.label}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
                                            {alert.alert_type}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", flexShrink: 0 }}>
                                        <Clock size={11} />
                                        {timeAgo(alert.timestamp)}
                                    </div>

                                    {/* Resolve button */}
                                    {!isResolved && (
                                        <button
                                            className="btn-ghost"
                                            style={{ fontSize: "0.75rem", padding: "0.3rem 0.625rem", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)", flexShrink: 0 }}
                                            onClick={() => handleResolve(alert.id)}
                                            disabled={resolving[alert.id]}
                                        >
                                            {resolving[alert.id] ? "Resolving..." : "Resolve"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
