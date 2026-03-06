import React, { useState, useEffect, useCallback } from "react";
import { Rocket, CheckCircle2, Clock, GitMerge, GitPullRequest, Plus, RefreshCw, Trash2, X } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getDeployments, getDeploymentSummary, addDeployment, deleteDeployment } from "../services/api";

const statusStyle = (s) => {
    switch (s) {
        case "success":     return { bg: "rgba(16,185,129,1)",  color: "#fff" };
        case "in_progress": return { bg: "rgba(245,158,11,1)",  color: "#fff" };
        case "failed":      return { bg: "rgba(239,68,68,1)",   color: "#fff" };
        default:            return { bg: "var(--bg-elevated)",  color: "var(--text-muted)", border: "1px solid var(--border)" };
    }
};

const envStyle = (env) => {
    switch (env) {
        case "production": return { bg: "rgba(16,185,129,0.1)",  color: "#10B981" };
        case "staging":    return { bg: "rgba(59,130,246,0.1)",  color: "#3B82F6" };
        default:           return { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6" };
    }
};

const fmtDuration = (s) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
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

const EMPTY_FORM = { service: "", version: "", branch: "main", environment: "production", deployed_by: "", commit_hash: "", duration_seconds: "" };

export default function DeploymentsPage() {
    const [deployments, setDeployments] = useState([]);
    const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0, in_progress: 0, avg_duration_seconds: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [dRes, sRes] = await Promise.all([getDeployments(), getDeploymentSummary()]);
            setDeployments(dRes.data || []);
            setSummary(sRes.data || {});
        } catch {
            setDeployments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.service || !form.version) return;
        setSaving(true);
        try {
            const res = await addDeployment({
                service: form.service,
                version: form.version,
                branch: form.branch,
                environment: form.environment,
                deployed_by: form.deployed_by,
                commit_hash: form.commit_hash,
                duration_seconds: parseInt(form.duration_seconds, 10) || 0,
                status: "success",
            });
            setDeployments(prev => [res.data, ...prev]);
            setForm(EMPTY_FORM);
            setShowForm(false);
        } catch { }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteDeployment(id);
            setDeployments(prev => prev.filter(d => d.id !== id));
        } catch { }
        finally { setDeletingId(null); }
    };

    const successRate = summary.total > 0 ? ((summary.success / summary.total) * 100).toFixed(1) : "0.0";

    const kpiCards = [
        { title: "Total Deploys",   value: summary.total ?? 0,                  icon: Rocket,       color: "#10B981" },
        { title: "Success Rate",    value: `${successRate}%`,                   icon: CheckCircle2, color: "#10B981" },
        { title: "Avg Duration",    value: fmtDuration(summary.avg_duration_seconds), icon: Clock, color: "#3B82F6" },
        { title: "Failed",          value: summary.failed ?? 0,                 icon: Rocket,       color: "#EF4444" },
    ];

    return (
        <DashboardLayout pageTitle="Deployments" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Track and manage service deployments across environments
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
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>{card.value}</div>
                            </div>
                        </div>
                    );
                })}
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
                    {showForm ? "Cancel" : "Log Deployment"}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="surface" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                    <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Service *</label>
                            <input className="input" value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} placeholder="api-gateway" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Version *</label>
                            <input className="input" value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} placeholder="v2.14.0" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Branch</label>
                            <input className="input" value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} placeholder="main" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Environment</label>
                            <select className="input" value={form.environment} onChange={e => setForm(p => ({ ...p, environment: e.target.value }))}>
                                <option value="production">production</option>
                                <option value="staging">staging</option>
                                <option value="dev">dev</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Deployed By</label>
                            <input className="input" value={form.deployed_by} onChange={e => setForm(p => ({ ...p, deployed_by: e.target.value }))} placeholder="Your name" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Duration (seconds)</label>
                            <input className="input" type="number" value={form.duration_seconds} onChange={e => setForm(p => ({ ...p, duration_seconds: e.target.value }))} placeholder="204" />
                        </div>
                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.5rem 1.25rem", borderRadius: 6, border: "none", background: "#22c55e", color: "#000", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit" }}>
                                {saving ? "Saving..." : "Save Deployment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Deployment History</h3>
                </div>
                {loading ? (
                    <div style={{ padding: "3rem", textAlign: "center" }}>
                        <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }} />
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Loading deployments...</p>
                    </div>
                ) : deployments.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        No deployments yet. Log one above.
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table" style={{ minWidth: 900 }}>
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Version</th>
                                    <th>Branch</th>
                                    <th>Environment</th>
                                    <th>Status</th>
                                    <th>Duration</th>
                                    <th>Deployed by</th>
                                    <th style={{ textAlign: "right" }}>Time</th>
                                    <th style={{ textAlign: "right" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {deployments.map(d => {
                                    const ss = statusStyle(d.status);
                                    const es = envStyle(d.environment);
                                    const isFeatureOrHotfix = d.branch && (d.branch.includes("hotfix") || d.branch.includes("feature"));
                                    return (
                                        <tr key={d.id}>
                                            <td style={{ fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>{d.service}</td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace" }}>
                                                {d.version}
                                                {d.commit_hash && <span style={{ color: "var(--text-muted)" }}> ~ {d.commit_hash.slice(0, 7)}</span>}
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                                    {isFeatureOrHotfix ? <GitPullRequest size={13} /> : <GitMerge size={13} />}
                                                    {d.branch}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: "0.6875rem", fontWeight: 600, padding: "0.15rem 0.4rem", borderRadius: 4, background: es.bg, color: es.color, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace" }}>
                                                    {d.environment}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: 99, background: ss.bg, color: ss.color, border: ss.border, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                                    {d.status === "success" && <CheckCircle2 size={10} />}
                                                    {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                    <Clock size={13} /> {fmtDuration(d.duration_seconds)}
                                                </div>
                                            </td>
                                            <td style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>{d.deployed_by || "—"}</td>
                                            <td style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace" }}>{timeAgo(d.timestamp)}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <button
                                                    className="btn-ghost"
                                                    style={{ padding: "0.3rem 0.5rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                                                    onClick={() => handleDelete(d.id)}
                                                    disabled={deletingId === d.id}
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
