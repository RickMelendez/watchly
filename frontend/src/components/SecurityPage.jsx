import React, { useState, useEffect, useCallback } from "react";
import { Shield, FileText, CheckCircle2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getSecurityFindings, getSecuritySummary, addSecurityFinding, updateSecurityFinding, deleteSecurityFinding } from "../services/api";
import { OrbitalLoader } from "./ui/orbital-loader";

const severityStyle = (s) => {
    switch (s) {
        case "critical": return { bg: "rgba(239,68,68,0.1)",   color: "#EF4444",  border: "rgba(239,68,68,0.2)" };
        case "high":     return { bg: "rgba(245,158,11,0.1)",  color: "#F59E0B",  border: "rgba(245,158,11,0.2)" };
        case "medium":   return { bg: "rgba(59,130,246,0.1)",  color: "#3B82F6",  border: "rgba(59,130,246,0.2)" };
        case "low":      return { bg: "rgba(107,114,128,0.1)", color: "#6B7280",  border: "rgba(107,114,128,0.2)" };
        default:         return { bg: "var(--bg-elevated)",    color: "var(--text-muted)", border: "var(--border)" };
    }
};

const statusColor = (s) => {
    switch (s) {
        case "open":        return "#EF4444";
        case "in_progress": return "#3B82F6";
        case "resolved":    return "#10B981";
        default:            return "var(--text-muted)";
    }
};

const timeAgo = (ts) => {
    if (!ts) return "—";
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const scoreGrade = (score) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "D";
};

const EMPTY_FORM = { severity: "medium", vulnerability: "", resource: "", status: "open" };

export default function SecurityPage() {
    const [findings, setFindings] = useState([]);
    const [summary, setSummary] = useState({ total: 0, open: 0, resolved: 0, critical: 0, high: 0, medium: 0, low: 0, score: 100 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [fRes, sRes] = await Promise.all([getSecurityFindings(), getSecuritySummary()]);
            setFindings(fRes.data || []);
            setSummary(sRes.data || {});
        } catch {
            setFindings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.vulnerability) return;
        setSaving(true);
        try {
            const res = await addSecurityFinding(form);
            setFindings(prev => [res.data, ...prev]);
            setForm(EMPTY_FORM);
            setShowForm(false);
            load();
        } catch { }
        finally { setSaving(false); }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateSecurityFinding(id, { status: newStatus });
            setFindings(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
            load();
        } catch { }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteSecurityFinding(id);
            setFindings(prev => prev.filter(f => f.id !== id));
            load();
        } catch { }
        finally { setDeletingId(null); }
    };

    const scoreColor = summary.score >= 90 ? "#10B981" : summary.score >= 70 ? "#F59E0B" : "#EF4444";

    return (
        <DashboardLayout pageTitle="Security Audit" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Vulnerability tracking and security posture
            </p>

            {/* Score Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {/* Overall Score */}
                <div className="surface" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${scoreColor}18`, border: `4px solid ${scoreColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: scoreColor }}>{scoreGrade(summary.score)}</span>
                    </div>
                    <div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>Security Score</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>{summary.score} / 100</div>
                    </div>
                </div>

                {/* Vulnerabilities */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <Shield size={18} color="#3B82F6" />
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Open Findings</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        {[
                            { label: "Critical", value: summary.critical, color: "#EF4444" },
                            { label: "High",     value: summary.high,     color: "#F59E0B" },
                            { label: "Medium",   value: summary.medium,   color: "#3B82F6" },
                            { label: "Low",      value: summary.low,      color: "#6B7280" },
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: item.value > 0 ? item.color : "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{item.value}</div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status summary */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <FileText size={18} color="#10B981" />
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Finding Status</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {[
                            { label: "Total",    value: summary.total,    color: "var(--text-primary)" },
                            { label: "Open",     value: summary.open,     color: "#EF4444" },
                            { label: "Resolved", value: summary.resolved, color: "#10B981" },
                        ].map(item => (
                            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                                <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                                <span style={{ color: item.color, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                    {item.label === "Resolved" && item.value > 0 && <CheckCircle2 size={12} />}
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <button className="btn-ghost" onClick={load} disabled={loading} style={{ padding: "0.35rem 0.625rem" }}>
                    <RefreshCw size={13} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
                    Refresh
                </button>
                <button
                    onClick={() => setShowForm(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.45rem 0.875rem", borderRadius: 6, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
                >
                    {showForm ? <X size={14} /> : <Plus size={14} />}
                    {showForm ? "Cancel" : "Add Finding"}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="surface" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                    <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Severity</label>
                            <select className="input" value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Resource</label>
                            <input className="input" value={form.resource} onChange={e => setForm(p => ({ ...p, resource: e.target.value }))} placeholder="container/api-gateway" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Status</label>
                            <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Vulnerability *</label>
                            <input className="input" value={form.vulnerability} onChange={e => setForm(p => ({ ...p, vulnerability: e.target.value }))} placeholder="e.g. Outdated OpenSSL Version (CVE-2023-1245)" required />
                        </div>
                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.5rem 1.25rem", borderRadius: 6, border: "none", background: "#22c55e", color: "#000", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit" }}>
                                {saving ? "Saving..." : "Add Finding"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Findings Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Security Findings</h3>
                </div>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <OrbitalLoader message="Loading findings..." />
                    </div>
                ) : findings.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                        <CheckCircle2 size={32} color="#22c55e" />
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>No security findings</p>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-muted)" }}>Your security posture looks clean.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Severity</th>
                                    <th>Vulnerability</th>
                                    <th>Resource</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "right" }}>Detected</th>
                                    <th style={{ textAlign: "right" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {findings.map(f => {
                                    const ss = severityStyle(f.severity);
                                    return (
                                        <tr key={f.id}>
                                            <td>
                                                <span style={{ fontSize: "0.6875rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: 4, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, textTransform: "uppercase" }}>
                                                    {f.severity}
                                                </span>
                                            </td>
                                            <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{f.vulnerability}</td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)", fontSize: "0.8125rem" }}>{f.resource || "—"}</td>
                                            <td>
                                                <select
                                                    value={f.status}
                                                    onChange={e => handleStatusChange(f.id, e.target.value)}
                                                    style={{ background: "transparent", border: "none", color: statusColor(f.status), fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", outline: "none" }}
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </td>
                                            <td style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.8125rem" }}>{timeAgo(f.detected_at)}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <button
                                                    className="btn-ghost"
                                                    style={{ padding: "0.3rem 0.5rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                                                    onClick={() => handleDelete(f.id)}
                                                    disabled={deletingId === f.id}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
