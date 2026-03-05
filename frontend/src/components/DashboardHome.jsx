import React from "react";
import { Server, AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
    { time: '00:00', requests: 4000, errors: 240 },
    { time: '04:00', requests: 3000, errors: 139 },
    { time: '08:00', requests: 2000, errors: 980 },
    { time: '12:00', requests: 2780, errors: 390 },
    { time: '16:00', requests: 1890, errors: 480 },
    { time: '20:00', requests: 2390, errors: 380 },
    { time: '24:00', requests: 3490, errors: 430 },
];

const pieData = [
    { name: 'US East', value: 400 },
    { name: 'US West', value: 300 },
    { name: 'EU Central', value: 300 },
    { name: 'AP South', value: 200 },
];
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#6366F1'];

const DashboardHome = () => {
    return (
        <DashboardLayout pageTitle="Infrastructure Overview">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                High-level metrics across all services and environments
            </p>

            {/* Top Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                    { title: "Total Requests (24h)", value: "2.4M", trend: "+12.5%", color: "#10B981" },
                    { title: "Avg Latency", value: "142ms", trend: "-5.2%", color: "#3B82F6" },
                    { title: "Active Incidents", value: "2", trend: "+2", color: "#EF4444" },
                    { title: "Total Deployments", value: "48", trend: "+14", color: "#8B5CF6" }
                ].map((stat, i) => (
                    <div key={i} className="surface" style={{ padding: "1.25rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
                            {stat.title}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                                color: stat.color,
                                backgroundColor: `rgba(${stat.color === '#EF4444' ? '239,68,68' : stat.color === '#10B981' ? '16,185,129' : stat.color === '#8B5CF6' ? '139,92,246' : '59,130,246'}, 0.1)`,
                                padding: "0.15rem 0.4rem",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.1rem"
                            }}>
                                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : null}{stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {/* Area Chart */}
                <div className="surface" style={{ padding: "1.5rem", height: "350px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>Total Requests</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000} k`} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: 8, fontSize: '0.8rem' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Area type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="surface" style={{ padding: "1.5rem", height: "350px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.9375rem", fontWeight: 600 }}>Traffic by Region</h3>
                    <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: 8, fontSize: '0.8rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Simplified Legend */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
                        {pieData.map((entry, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS[index] }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Deployments & Active Incidents */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

                {/* Recent Deployments */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Recent Deployments</h3>
                        <span style={{ fontSize: "0.75rem", color: "#3B82F6", cursor: "pointer", fontWeight: 500 }}>View All</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {[
                            { service: "api-gateway", env: "production", time: "2m ago", status: "Success" },
                            { service: "auth-service", env: "staging", time: "15m ago", status: "Success" },
                            { service: "web-frontend", env: "production", time: "1h ago", status: "Failed" }
                        ].map((dep, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ background: "var(--bg-elevated)", padding: "0.4rem", borderRadius: 6, border: "1px solid var(--border)" }}>
                                        <Server size={14} color="var(--text-secondary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.875rem", fontWeight: 500, fontFamily: "JetBrains Mono, monospace" }}>{dep.service}</div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{dep.env}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "0.75rem", color: dep.status === 'Success' ? '#10B981' : '#EF4444', display: "flex", alignItems: "center", gap: "0.25rem", justifyContent: "flex-end" }}>
                                        {dep.status === 'Success' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                        {dep.status}
                                    </div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{dep.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Incidents */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Active Incidents</h3>
                        <span style={{ fontSize: "0.75rem", color: "#3B82F6", cursor: "pointer", fontWeight: 500 }}>View All</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {[
                            { title: "High memory usage on API Gateway", severity: "Warning", time: "10m ago", id: "INC-842" },
                            { title: "Database connection timeouts in EU Central", severity: "Critical", time: "42m ago", id: "INC-841" }
                        ].map((inc, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", paddingBottom: "1rem", borderBottom: i < 1 ? "1px solid var(--border-subtle)" : "none" }}>
                                <div style={{ background: inc.severity === 'Critical' ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", padding: "0.4rem", borderRadius: 6, color: inc.severity === 'Critical' ? "#EF4444" : "#F59E0B" }}>
                                    <AlertTriangle size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.15rem", lineHeight: 1.4 }}>{inc.title}</div>
                                    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                                        <span style={{ color: inc.severity === 'Critical' ? "#EF4444" : "#F59E0B" }}>{inc.severity}</span>
                                        <span>•</span>
                                        <span>{inc.id}</span>
                                        <span>•</span>
                                        <span>{inc.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default DashboardHome;
