import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "./DashboardLayout";
import api, { updateAlert } from "../services/api";
import { OrbitalLoader } from "./ui/orbital-loader";

const SEVERITY = {
    high: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "High" },
    medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", label: "Medium" },
    low: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", label: "Low" },
};

const getSeverity = (alert) => {
    if (alert.severity) return SEVERITY[alert.severity] || SEVERITY.medium;
    // infer from message
    if (alert.message?.toLowerCase().includes("down") || alert.message?.toLowerCase().includes("offline")) return SEVERITY.high;
    if (alert.message?.toLowerCase().includes("slow")) return SEVERITY.medium;
    return SEVERITY.low;
};

const formatTime = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return isNaN(d) ? ts : d.toLocaleString();
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState({});
    const [filter, setFilter] = useState("all"); // all | unresolved | resolved

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
        setResolving((p) => ({ ...p, [alertId]: true }));
        try {
            await updateAlert(alertId, "resolved");
            setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, status: "resolved" } : a));
        } catch { }
        finally {
            setResolving((p) => ({ ...p, [alertId]: false }));
        }
    };

    const filtered = alerts.filter((a) => {
        if (filter === "unresolved") return a.status !== "resolved";
        if (filter === "resolved") return a.status === "resolved";
        return true;
    });

    const unresolvedCount = alerts.filter((a) => a.status !== "resolved").length;

    return (
        <DashboardLayout pageTitle="Alerts" alertCount={unresolvedCount}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                    {["all", "unresolved", "resolved"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: "0.35rem 0.75rem",
                                borderRadius: 6,
                                border: "1px solid",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                transition: "all 0.15s",
                                background: filter === f ? "rgba(34,197,94,0.1)" : "var(--bg-surface)",
                                color: filter === f ? "#22c55e" : "var(--text-secondary)",
                                borderColor: filter === f ? "rgba(34,197,94,0.3)" : "var(--border)",
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {f === "unresolved" && unresolvedCount > 0 && (
                                <span style={{ marginLeft: "0.375rem", background: "#ef4444", color: "#fff", borderRadius: "9999px", padding: "0.05rem 0.35rem", fontSize: "0.65rem", fontWeight: 700 }}>
                                    {unresolvedCount}
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

            {/* Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertTriangle size={14} color="#f59e0b" />
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Alert History</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "0.1rem 0.4rem", borderRadius: 4 }}>
                        {filtered.length} alerts
                    </span>
                </div>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <OrbitalLoader message="Fetching alerts..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                        <CheckCircle size={32} color="#22c55e" />
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                            {filter === "unresolved" ? "No active alerts" : "No alerts found"}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.8125rem" }}>
                            {filter === "unresolved" ? "All systems are running smoothly." : "No alert history to display."}
                        </p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Website</th>
                                <th>Message</th>
                                <th>Severity</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.map((alert, i) => {
                                    const sev = getSeverity(alert);
                                    const isResolved = alert.status === "resolved";
                                    return (
                                        <motion.tr
                                            key={alert.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.2, delay: i * 0.03 }}
                                        >
                                            <td>
                                                <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.8125rem" }}>
                                                        {alert.website_url || alert.website?.url || `Site #${alert.website_id}`}
                                                    </span>
                                                    {alert.website_url && (
                                                        <a href={alert.website_url} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}>
                                                            <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ color: "var(--text-secondary)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {alert.message || "Service unavailable"}
                                            </td>
                                            <td>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.55rem", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 600, background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: sev.color }} />
                                                    {sev.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                                    <Clock size={11} />
                                                    <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{formatTime(alert.created_at || alert.timestamp)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                                    padding: "0.2rem 0.55rem", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 500,
                                                    background: isResolved ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                                                    color: isResolved ? "#22c55e" : "#ef4444",
                                                    border: `1px solid ${isResolved ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                                                }}>
                                                    {isResolved ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                                    {isResolved ? "Resolved" : "Active"}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                {!isResolved && (
                                                    <button
                                                        className="btn-ghost"
                                                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.625rem", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" }}
                                                        onClick={() => handleResolve(alert.id)}
                                                        disabled={resolving[alert.id]}
                                                    >
                                                        {resolving[alert.id] ? "Resolving..." : "Resolve"}
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}
