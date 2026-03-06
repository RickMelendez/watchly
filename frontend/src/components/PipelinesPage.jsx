import React, { useState, useEffect, useCallback } from "react";
import { GitBranch, CheckCircle2, XCircle, Loader2, Circle, Clock, Plus, RefreshCw, Trash2, X, Activity } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getPipelines, getPipelineSummary, addPipeline, deletePipeline } from "../services/api";

const triggerStyle = (t) => {
    switch (t) {
        case "push":     return { bg: "rgba(16,185,129,0.15)",  color: "#10B981" };
        case "pr":       return { bg: "rgba(139,92,246,0.15)", color: "#8B5CF6" };
        case "schedule": return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
        case "manual":   return { bg: "rgba(59,130,246,0.15)", color: "#3B82F6" };
        default:         return { bg: "var(--bg-elevated)",    color: "var(--text-secondary)" };
    }
};

const renderStepIcon = (status) => {
    switch (status) {
        case "success":  return <CheckCircle2 size={18} color="#10B981" />;
        case "failed":   return <XCircle size={18} color="#EF4444" />;
        case "running":  return <Loader2 size={18} color="#3B82F6" style={{ animation: "spin 0.8s linear infinite" }} />;
        default:         return <Circle size={18} color="var(--border)" strokeWidth={2} />;
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

const DEFAULT_STAGES = '[{"name":"Build","status":"success"},{"name":"Test","status":"success"},{"name":"Deploy","status":"success"}]';
const EMPTY_FORM = { run_id: "", trigger: "push", commit_message: "", branch: "main", commit_hash: "", author: "", status: "success", duration_seconds: "", stages: DEFAULT_STAGES };

export default function PipelinesPage() {
    const [pipelines, setPipelines] = useState([]);
    const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0, running: 0, success_rate: 0, avg_duration_seconds: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [pRes, sRes] = await Promise.all([getPipelines(), getPipelineSummary()]);
            setPipelines(pRes.data || []);
            setSummary(sRes.data || {});
        } catch {
            setPipelines([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.run_id) return;
        let stages = [];
        try { stages = JSON.parse(form.stages); } catch { stages = []; }
        setSaving(true);
        try {
            const res = await addPipeline({
                run_id: form.run_id,
                trigger: form.trigger,
                commit_message: form.commit_message,
                branch: form.branch,
                commit_hash: form.commit_hash,
                author: form.author,
                status: form.status,
                stages,
                duration_seconds: parseInt(form.duration_seconds, 10) || 0,
            });
            setPipelines(prev => [res.data, ...prev]);
            setForm(EMPTY_FORM);
            setShowForm(false);
        } catch { }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deletePipeline(id);
            setPipelines(prev => prev.filter(p => p.id !== id));
        } catch { }
        finally { setDeletingId(null); }
    };

    const kpiCards = [
        { title: "Total Runs",    value: summary.total ?? 0,            color: "#10B981" },
        { title: "Success Rate",  value: `${summary.success_rate ?? 0}%`, color: "#10B981" },
        { title: "Failed",        value: summary.failed ?? 0,           color: "#EF4444" },
        { title: "Avg Duration",  value: fmtDuration(summary.avg_duration_seconds), color: "#3B82F6" },
    ];

    return (
        <DashboardLayout pageTitle="CI/CD Pipelines" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Monitor build and deployment workflows
            </p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {kpiCards.map((card, i) => (
                    <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ padding: "0.625rem", borderRadius: 8, background: `${card.color}18` }}>
                            <Activity size={20} color={card.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>{card.title}</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>{card.value}</div>
                        </div>
                    </div>
                ))}
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
                    {showForm ? "Cancel" : "Log Run"}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="surface" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                    <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Run ID *</label>
                            <input className="input" value={form.run_id} onChange={e => setForm(p => ({ ...p, run_id: e.target.value }))} placeholder="run-4821" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Trigger</label>
                            <select className="input" value={form.trigger} onChange={e => setForm(p => ({ ...p, trigger: e.target.value }))}>
                                <option value="push">push</option>
                                <option value="pr">PR</option>
                                <option value="manual">manual</option>
                                <option value="schedule">schedule</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Status</label>
                            <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                <option value="success">success</option>
                                <option value="failed">failed</option>
                                <option value="running">running</option>
                                <option value="cancelled">cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Commit Message</label>
                            <input className="input" value={form.commit_message} onChange={e => setForm(p => ({ ...p, commit_message: e.target.value }))} placeholder="feat: add real-time metrics" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Branch</label>
                            <input className="input" value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} placeholder="main" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Author</label>
                            <input className="input" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Sarah Kim" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Duration (seconds)</label>
                            <input className="input" type="number" value={form.duration_seconds} onChange={e => setForm(p => ({ ...p, duration_seconds: e.target.value }))} placeholder="272" />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Stages (JSON)</label>
                            <input className="input" value={form.stages} onChange={e => setForm(p => ({ ...p, stages: e.target.value }))} placeholder='[{"name":"Build","status":"success"}]' />
                        </div>
                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.5rem 1.25rem", borderRadius: 6, border: "none", background: "#22c55e", color: "#000", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit" }}>
                                {saving ? "Saving..." : "Save Run"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pipeline list */}
            {loading ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                    <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Loading pipelines...</p>
                </div>
            ) : pipelines.length === 0 ? (
                <div className="surface" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    No pipeline runs yet. Log one above.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {pipelines.map(pipeline => {
                        const ts = triggerStyle(pipeline.trigger);
                        const stages = Array.isArray(pipeline.stages) ? pipeline.stages : [];
                        return (
                            <div key={pipeline.id} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                                {/* Left: Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{pipeline.run_id}</span>
                                        <span style={{ fontSize: "0.625rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: 4, background: ts.bg, color: ts.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                            {pipeline.trigger}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {pipeline.commit_message || pipeline.run_id}
                                    </h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                            <GitBranch size={14} />
                                            <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{pipeline.branch}</span>
                                            {pipeline.commit_hash && (
                                                <>
                                                    <span style={{ margin: "0 0.25rem", color: "var(--border)" }}>→</span>
                                                    <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{pipeline.commit_hash.slice(0, 7)}</span>
                                                </>
                                            )}
                                        </div>
                                        {pipeline.author && <span>{pipeline.author}</span>}
                                    </div>
                                </div>

                                {/* Right: Steps + Time + Delete */}
                                <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexShrink: 0 }}>
                                    {stages.length > 0 && (
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            {stages.map((step, idx) => (
                                                <React.Fragment key={idx}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
                                                        {renderStepIcon(step.status)}
                                                        <span style={{ fontSize: "0.6875rem", color: step.status === "pending" || step.status === "skipped" ? "var(--text-muted)" : "var(--text-secondary)", fontWeight: 500 }}>
                                                            {step.name}
                                                        </span>
                                                    </div>
                                                    {idx < stages.length - 1 && (
                                                        <div style={{ width: 28, height: 1, background: step.status === "success" ? "#10B981" : "var(--border)", margin: "0 6px 16px 6px" }} />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", minWidth: 80 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                            <Clock size={13} color="var(--text-muted)" />
                                            {fmtDuration(pipeline.duration_seconds)}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{timeAgo(pipeline.timestamp)}</div>
                                    </div>
                                    <button
                                        className="btn-ghost"
                                        style={{ padding: "0.3rem 0.5rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                                        onClick={() => handleDelete(pipeline.id)}
                                        disabled={deletingId === pipeline.id}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
