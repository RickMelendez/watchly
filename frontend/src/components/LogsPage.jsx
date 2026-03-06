import React, { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Plus, Trash2, X } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getLogs, addLog, clearLogs } from "../services/api";

const LEVELS = ["ALL", "DEBUG", "INFO", "WARN", "ERROR"];

const levelStyle = (level) => {
    switch (level) {
        case "ERROR": return { bg: "rgba(239,68,68,0.15)",  color: "#EF4444" };
        case "WARN":  return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
        case "INFO":  return { bg: "rgba(16,185,129,0.15)", color: "#10B981" };
        case "DEBUG": return { bg: "var(--bg-elevated)",    color: "var(--text-muted)" };
        default:      return { bg: "var(--bg-elevated)",    color: "var(--text-secondary)" };
    }
};

const msgColor = (level) => {
    switch (level) {
        case "ERROR": return "#EF4444";
        case "WARN":  return "#FCD34D";
        case "DEBUG": return "var(--text-muted)";
        default:      return "var(--text-secondary)";
    }
};

const EMPTY_FORM = { level: "INFO", service: "", message: "" };

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("") ;
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [clearing, setClearing] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getLogs(activeTab, search);
            setLogs(res.data || []);
        } catch {
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, search]);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.message) return;
        setSaving(true);
        try {
            const res = await addLog({ level: form.level, service: form.service || "app", message: form.message });
            setLogs(prev => [res.data, ...prev]);
            setForm(EMPTY_FORM);
            setShowForm(false);
        } catch { }
        finally { setSaving(false); }
    };

    const handleClear = async () => {
        if (!window.confirm("Clear all logs? This cannot be undone.")) return;
        setClearing(true);
        try {
            await clearLogs();
            setLogs([]);
        } catch { }
        finally { setClearing(false); }
    };

    return (
        <DashboardLayout pageTitle="Log Explorer" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Search and filter logs across all services
            </p>

            <div className="surface" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
                {/* Toolbar */}
                <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                        <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.625rem 1rem 0.625rem 2.5rem", color: "var(--text-primary)", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* Level tabs */}
                    <div style={{ display: "flex", background: "var(--bg-elevated)", padding: "0.25rem", borderRadius: 8, border: "1px solid var(--border)" }}>
                        {LEVELS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{ padding: "0.4rem 0.75rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)", background: activeTab === tab ? "var(--border)" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <button className="btn-ghost" onClick={load} disabled={loading} style={{ padding: "0.45rem 0.75rem" }}>
                        <RefreshCw size={13} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.45rem 0.875rem", borderRadius: 6, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
                    >
                        {showForm ? <X size={13} /> : <Plus size={13} />}
                        {showForm ? "Cancel" : "Add Log"}
                    </button>
                    <button className="btn-ghost" onClick={handleClear} disabled={clearing} style={{ padding: "0.45rem 0.75rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}>
                        <Trash2 size={13} />
                        Clear
                    </button>
                </div>

                {/* Add form */}
                {showForm && (
                    <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                        <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                            <div>
                                <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>Level</label>
                                <select className="input" style={{ width: 90 }} value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                                    {["DEBUG","INFO","WARN","ERROR"].map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>Service</label>
                                <input className="input" style={{ width: 140 }} value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} placeholder="api-gateway" />
                            </div>
                            <div style={{ flex: 1, minWidth: 240 }}>
                                <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>Message *</label>
                                <input className="input" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Log message..." required />
                            </div>
                            <button type="submit" disabled={saving} style={{ padding: "0.5rem 1rem", borderRadius: 6, border: "none", background: "#22c55e", color: "#000", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                                {saving ? "Adding..." : "Add"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Log list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
                    {loading ? (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                            <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }} />
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Loading logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                            No logs found. Add one above or adjust filters.
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {logs.map((log, i) => {
                                const ls = levelStyle(log.level);
                                return (
                                    <div
                                        key={log.id}
                                        style={{ padding: "0.625rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.02)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", fontFamily: "JetBrains Mono, monospace" }}
                                    >
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "0.1rem" }}>
                                            {log.timestamp ? new Date(log.timestamp).toISOString().replace("T", " ").slice(0, 23) : "—"}
                                        </div>
                                        <div style={{ width: 60, flexShrink: 0 }}>
                                            <span style={{ fontSize: "0.625rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: 4, background: ls.bg, color: ls.color, display: "inline-block", textAlign: "center", width: "100%" }}>
                                                {log.level}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "0.1rem" }}>
                                            [{log.service}]
                                        </div>
                                        <div style={{ fontSize: "0.8125rem", color: msgColor(log.level), wordBreak: "break-all", lineHeight: 1.5, flex: 1 }}>
                                            {log.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
