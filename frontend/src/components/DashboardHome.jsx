import React, { useState, useEffect, useCallback } from "react";
import { Globe, AlertTriangle, CheckCircle2, XCircle, Activity } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { getDashboardSummary } from "../services/api";
import { OrbitalLoader } from "./ui/orbital-loader";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

const STATUS_COLORS = ["#10B981", "#EF4444"];

const DashboardHome = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        try {
            const res = await getDashboardSummary();
            setSummary(res.data);
        } catch (err) {
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const interval = setInterval(load, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [load]);

    if (loading) {
        return (
            <DashboardLayout pageTitle="Infrastructure Overview">
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                    <OrbitalLoader />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout pageTitle="Infrastructure Overview">
                <div className="surface" style={{ padding: "2rem", textAlign: "center", color: "#EF4444" }}>
                    {error}
                </div>
            </DashboardLayout>
        );
    }

    const {
        websites_count = 0,
        avg_response_time = 0,
        active_alerts = 0,
        uptime_percentage = 0,
        response_trend = [],
        recent_alerts = [],
        website_statuses = [],
    } = summary || {};

    const upCount = website_statuses.filter(s => s.status === "up").length;
    const downCount = website_statuses.filter(s => s.status === "down").length;
    const pieData = [
        { name: "Up", value: upCount || 0 },
        { name: "Down", value: downCount || 0 },
    ].filter(d => d.value > 0);

    const kpiCards = [
        { title: "Websites Monitored", value: websites_count, icon: Globe, color: "#10B981" },
        { title: "Avg Response Time", value: `${avg_response_time} ms`, icon: Activity, color: "#3B82F6" },
        { title: "Active Alerts", value: active_alerts, icon: AlertTriangle, color: active_alerts > 0 ? "#EF4444" : "#10B981" },
        { title: "Overall Uptime", value: `${uptime_percentage}%`, icon: CheckCircle2, color: uptime_percentage >= 99 ? "#10B981" : uptime_percentage >= 95 ? "#F59E0B" : "#EF4444" },
    ];

    return (
        <DashboardLayout pageTitle="Infrastructure Overview" alertCount={active_alerts} onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                High-level metrics across all monitored services
            </p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {kpiCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="surface" style={{ padding: "1.25rem" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
                                {card.title}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                    {card.value}
                                </div>
                                <Icon size={18} color={card.color} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {/* Response Time Trend */}
                <div className="surface" style={{ padding: "1.5rem", height: "300px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>
                        Response Time — Last 24h
                    </h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        {response_trend.length === 0 ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                No data yet — add websites to start monitoring
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={response_trend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="rtGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                    <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}ms`} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", borderRadius: 8, fontSize: "0.8rem" }}
                                        itemStyle={{ color: "var(--text-primary)" }}
                                        labelStyle={{ color: "var(--text-secondary)" }}
                                        formatter={v => [`${v} ms`, "Avg Response"]}
                                    />
                                    <Area type="monotone" dataKey="response_time" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#rtGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Website Status Pie */}
                <div className="surface" style={{ padding: "1.5rem", height: "300px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>Website Status</h3>
                    {pieData.length === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)", fontSize: "0.875rem" }}>
                            No websites yet
                        </div>
                    ) : (
                        <>
                            <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                                            {pieData.map((_, idx) => (
                                                <Cell key={idx} fill={STATUS_COLORS[idx]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", borderRadius: 8, fontSize: "0.8rem" }}
                                            itemStyle={{ color: "var(--text-primary)" }}
                                            labelStyle={{ color: "var(--text-secondary)" }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center label */}
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                                        {upCount + downCount}
                                    </div>
                                    <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
                                        sites
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "0.75rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#10B981", fontWeight: 600 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                                    Up &nbsp;<span style={{ fontFamily: "JetBrains Mono, monospace" }}>({upCount})</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#EF4444", fontWeight: 600 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
                                    Down &nbsp;<span style={{ fontFamily: "JetBrains Mono, monospace" }}>({downCount})</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Website Statuses */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>Monitored Websites</h3>
                    {website_statuses.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No websites monitored yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {website_statuses.map((site, i) => (
                                <div key={site.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: i < website_statuses.length - 1 ? "0.75rem" : 0, borderBottom: i < website_statuses.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        {site.status === "up"
                                            ? <CheckCircle2 size={14} color="#10B981" />
                                            : <XCircle size={14} color="#EF4444" />
                                        }
                                        <div>
                                            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{site.name}</div>
                                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{site.url.replace(/^https?:\/\//, "")}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: site.status === "up" ? "#10B981" : "#EF4444", fontFamily: "JetBrains Mono, monospace" }}>
                                            {site.response_time} ms
                                        </div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{site.uptime_pct}% uptime</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Alerts */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>Active Alerts</h3>
                    {recent_alerts.length === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontSize: "0.875rem" }}>
                            <CheckCircle2 size={14} />
                            All systems operational
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {recent_alerts.map((alert, i) => (
                                <div key={alert.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", paddingBottom: i < recent_alerts.length - 1 ? "0.75rem" : 0, borderBottom: i < recent_alerts.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                                    <div style={{ background: "rgba(239,68,68,0.1)", padding: "0.35rem", borderRadius: 6, flexShrink: 0 }}>
                                        <AlertTriangle size={13} color="#EF4444" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{alert.website_name}</div>
                                        <div style={{ fontSize: "0.75rem", color: "#EF4444", fontFamily: "JetBrains Mono, monospace" }}>{alert.alert_type}</div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardHome;
