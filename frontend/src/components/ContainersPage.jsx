import React, { useState, useEffect, useCallback } from "react";
import { Package, Play, Square, Cpu, CheckCircle2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getContainers, getContainerSummary, addContainer, deleteContainer } from "../services/api";
import { OrbitalLoader } from "./ui/orbital-loader";

const statusStyle = (s) => {
    switch (s) {
        case "running":  return { bg: "rgba(16,185,129,1)",   color: "#fff", label: "Running" };
        case "stopped":  return { bg: "var(--bg-elevated)",    color: "var(--text-muted)", border: "1px solid var(--border)", label: "Stopped" };
        case "error":    return { bg: "rgba(239,68,68,1)",     color: "#fff", label: "Error" };
        default:         return { bg: "var(--bg-elevated)",    color: "var(--text-secondary)", label: s };
    }
};

const uptimeStr = (started_at) => {
    if (!started_at) return "—";
    const diff = Math.floor((Date.now() - new Date(started_at)) / 1000);
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    return `${d}d ${h}h`;
};

const EMPTY_FORM = { name: "", image: "", ports: "", memory_limit: "512" };

export default function ContainersPage() {
    const [containers, setContainers] = useState([]);
    const [summary, setSummary] = useState({ total: 0, running: 0, stopped: 0, error: 0, avg_cpu: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [cRes, sRes] = await Promise.all([getContainers(), getContainerSummary()]);
            setContainers(cRes.data || []);
            setSummary(sRes.data || {});
        } catch {
            setContainers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name || !form.image) return;
        setSaving(true);
        try {
            const res = await addContainer({
                name: form.name,
                image: form.image,
                ports: form.ports,
                memory_limit: parseInt(form.memory_limit, 10) || 512,
                status: "running",
            });
            setContainers(prev => [res.data, ...prev]);
            setSummary(prev => ({ ...prev, total: (prev.total || 0) + 1, running: (prev.running || 0) + 1 }));
            setForm(EMPTY_FORM);
            setShowForm(false);
        } catch { }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteContainer(id);
            setContainers(prev => prev.filter(c => c.id !== id));
        } catch { }
        finally { setDeletingId(null); }
    };

    const kpiCards = [
        { title: "Total Containers", value: summary.total ?? 0,   icon: Package, color: "#10B981" },
        { title: "Running",           value: summary.running ?? 0, icon: Play,    color: "#10B981" },
        { title: "Stopped / Error",   value: (summary.stopped ?? 0) + (summary.error ?? 0), icon: Square, color: "#6B7280" },
        { title: "Avg CPU",           value: `${summary.avg_cpu ?? 0}%`, icon: Cpu, color: "#0EA5E9" },
    ];

    return (
        <DashboardLayout pageTitle="Containers" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Overview of running containers and resource usage
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

            {/* Header row with Add button */}
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
                    {showForm ? "Cancel" : "Add Container"}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="surface" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                    <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "flex-end" }}>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Name *</label>
                            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="api-gateway" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Image *</label>
                            <input className="input" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="nginx:1.25-alpine" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Ports</label>
                            <input className="input" value={form.ports} onChange={e => setForm(p => ({ ...p, ports: e.target.value }))} placeholder="8080:80" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Memory Limit (MB)</label>
                            <input className="input" type="number" value={form.memory_limit} onChange={e => setForm(p => ({ ...p, memory_limit: e.target.value }))} placeholder="512" />
                        </div>
                        <button type="submit" disabled={saving} style={{ padding: "0.5rem 1rem", borderRadius: 6, border: "none", background: "#22c55e", color: "#000", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit" }}>
                            {saving ? "Adding..." : "Add"}
                        </button>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Container Instances</h3>
                </div>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <OrbitalLoader message="Loading containers..." />
                    </div>
                ) : containers.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        No containers yet. Add one above.
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table" style={{ minWidth: 900 }}>
                            <thead>
                                <tr>
                                    <th>Container</th>
                                    <th>Image</th>
                                    <th>Status</th>
                                    <th>CPU</th>
                                    <th>Memory</th>
                                    <th>Ports</th>
                                    <th>Uptime</th>
                                    <th style={{ textAlign: "right" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {containers.map(c => {
                                    const ss = statusStyle(c.status);
                                    return (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <CheckCircle2 size={14} color={c.status === "running" ? "#10B981" : c.status === "error" ? "#EF4444" : "var(--text-muted)"} />
                                                    {c.name}
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{c.image}</td>
                                            <td>
                                                <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: 99, background: ss.bg, color: ss.color, border: ss.border }}>
                                                    {ss.label}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>{c.cpu_percent}%</td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                                {c.memory_used} <span style={{ color: "var(--text-muted)" }}>/ {c.memory_limit} MB</span>
                                            </td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{c.ports || "—"}</td>
                                            <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{uptimeStr(c.started_at)}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <button
                                                    className="btn-ghost"
                                                    style={{ padding: "0.3rem 0.5rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                                                    onClick={() => handleDelete(c.id)}
                                                    disabled={deletingId === c.id}
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
