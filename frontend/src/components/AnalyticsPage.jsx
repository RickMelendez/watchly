import React, { useState, useEffect, useCallback } from "react";
import { Activity, CheckCircle2, AlertTriangle, BarChart2 } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import DashboardLayout from "./DashboardLayout";
import { getAnalyticsSummary } from "../services/api";
import { OrbitalLoader } from "./ui/orbital-loader";

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const res = await getAnalyticsSummary();
            setData(res.data);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    if (loading) return <DashboardLayout pageTitle="Analytics"><div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><OrbitalLoader /></div></DashboardLayout>;

    const {
        total_checks = 0,
        avg_response_time = 0,
        uptime_percentage = 0,
        total_alerts = 0,
        response_trend = [],
        website_performance = [],
    } = data || {};

    // Filter out null points for the chart (no data days)
    const trendWithData = response_trend.filter(d => d.response_time !== null);

    const kpiCards = [
        { title: "Total Checks (All Time)", value: total_checks.toLocaleString(), icon: Activity, color: "#10B981" },
        { title: "Avg Response Time (30d)", value: `${avg_response_time} ms`, icon: BarChart2, color: "#3B82F6" },
        { title: "Uptime (30d)", value: `${uptime_percentage}%`, icon: CheckCircle2, color: uptime_percentage >= 99 ? "#10B981" : uptime_percentage >= 95 ? "#F59E0B" : "#EF4444" },
        { title: "Total Alerts (All Time)", value: total_alerts.toLocaleString(), icon: AlertTriangle, color: total_alerts > 0 ? "#F59E0B" : "#10B981" },
    ];

    // Bar chart: top 5 websites by response time
    const topByResponseTime = [...website_performance]
        .filter(w => w.avg_response_time > 0)
        .slice(0, 5);

    return (
        <DashboardLayout pageTitle="Analytics" onRefresh={load}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Monitoring performance and reliability over time.
            </p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {kpiCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
                                    {card.title}
                                </div>
                                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                    {card.value}
                                </div>
                            </div>
                            <div style={{ padding: "0.625rem", borderRadius: 8, background: `${card.color}18` }}>
                                <Icon size={20} color={card.color} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {/* Response Time Trend */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>Response Time Trend</h3>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Daily average across all websites — last 30 days</p>
                    </div>
                    <div style={{ height: 280 }}>
                        {trendWithData.length === 0 ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                No data yet
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendWithData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="rtGrad30" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} interval={4} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={v => `${v}ms`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", borderRadius: 8, fontSize: "0.8rem" }}
                                        itemStyle={{ color: "var(--text-primary)" }}
                                        labelStyle={{ color: "var(--text-secondary)" }}
                                        formatter={v => v !== null ? [`${v} ms`, "Avg Response"] : ["No data", ""]}
                                    />
                                    <Area type="monotone" dataKey="response_time" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#rtGrad30)" connectNulls={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Response Time by Website (bar) */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>Avg Response by Site</h3>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Last 30 days</p>
                    </div>
                    <div style={{ height: 280 }}>
                        {topByResponseTime.length === 0 ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                No data yet
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topByResponseTime} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }} barSize={16}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-subtle)" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={v => `${v}ms`} />
                                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} width={70} />
                                    <Tooltip
                                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                                        contentStyle={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", borderRadius: 8, fontSize: "0.8rem" }}
                                        itemStyle={{ color: "var(--text-primary)" }}
                                        labelStyle={{ color: "var(--text-secondary)" }}
                                        formatter={v => [`${v} ms`, "Avg Response"]}
                                    />
                                    <Bar dataKey="avg_response_time" radius={[0, 4, 4, 0]}>
                                        {topByResponseTime.map((entry, i) => (
                                            <Cell key={i} fill={entry.avg_response_time < 200 ? "#10B981" : entry.avg_response_time < 500 ? "#F59E0B" : "#EF4444"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Website Performance Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Website Performance (30 days)</h3>
                </div>
                {website_performance.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        No websites monitored yet.
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Website</th>
                                <th style={{ textAlign: "right" }}>Uptime</th>
                                <th style={{ textAlign: "right" }}>Avg Response</th>
                                <th style={{ textAlign: "right" }}>Checks</th>
                                <th style={{ textAlign: "right" }}>Alerts</th>
                                <th style={{ textAlign: "right" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {website_performance.map(site => {
                                const uptimeColor = site.uptime_percentage >= 99 ? "#10B981" : site.uptime_percentage >= 95 ? "#F59E0B" : "#EF4444";
                                const rtColor = site.avg_response_time < 200 ? "#10B981" : site.avg_response_time < 500 ? "#F59E0B" : "#EF4444";
                                return (
                                    <tr key={site.id}>
                                        <td>
                                            <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.875rem" }}>{site.name}</div>
                                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{site.url.replace(/^https?:\/\//, "")}</div>
                                        </td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: uptimeColor }}>
                                            {site.uptime_percentage}%
                                        </td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: rtColor }}>
                                            {site.avg_response_time > 0 ? `${site.avg_response_time} ms` : "—"}
                                        </td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                            {site.checks.toLocaleString()}
                                        </td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: site.alerts_30d > 0 ? "#F59E0B" : "var(--text-muted)" }}>
                                            {site.alerts_30d}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                                padding: "0.2rem 0.5rem", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 600,
                                                background: site.uptime_percentage >= 99 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                                                color: uptimeColor,
                                                border: `1px solid ${uptimeColor}30`,
                                            }}>
                                                {site.uptime_percentage >= 99 ? "Healthy" : site.uptime_percentage >= 95 ? "Degraded" : "Down"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsPage;
