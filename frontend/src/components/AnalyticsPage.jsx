import React from "react";
import { Eye, Users, MousePointerClick, Clock } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import DashboardLayout from "./DashboardLayout";

const AnalyticsPage = () => {
    // Mock data based on the Signal Dashboard screenshot

    const summaryCards = [
        { title: "Page Views", value: "284,392", trend: "+24.7%", icon: Eye, color: "#10B981" },
        { title: "Unique Visitors", value: "42,847", trend: "+12.3%", icon: Users, color: "#0EA5E9" },
        { title: "Bounce Rate", value: "32.4%", trend: "-5.2%", isNegativeTrendGood: true, icon: MousePointerClick, color: "#8B5CF6" },
        { title: "Avg. Session", value: "4m 32s", trend: "+8.1%", icon: Clock, color: "#F59E0B" },
    ];

    const trafficData = [
        { month: "Jan", visitors: 220 },
        { month: "Feb", visitors: 300 },
        { month: "Mar", visitors: 280 },
        { month: "Apr", visitors: 400 },
        { month: "May", visitors: 420 },
        { month: "Jun", visitors: 385 },
        { month: "Jul", visitors: 480 },
        { month: "Aug", visitors: 560 },
        { month: "Sep", visitors: 520 },
        { month: "Oct", visitors: 580 },
        { month: "Nov", visitors: 650 },
        { month: "Dec", visitors: 680 },
    ];

    const costData = [
        { category: "Compute", cost: 35000 },
        { category: "Storage", cost: 18000 },
        { category: "Networking", cost: 12000 },
        { category: "Databases", cost: 8000 },
    ];

    const topPages = [
        { path: "/api/v1/servers", views: "12,847", unique: "8,392", bounce: "28%" },
        { path: "/api/v1/deployments", views: "9,234", unique: "6,128", bounce: "31%" },
        { path: "/dashboard", views: "8,456", unique: "5,901", bounce: "22%" },
        { path: "/settings/profile", views: "5,102", unique: "3,400", bounce: "15%" },
        { path: "/login", views: "4,890", unique: "4,200", bounce: "45%" },
    ];

    const topCountries = [
        { name: "United States", views: "12,847", percentage: 38 },
        { name: "United Kingdom", views: "6,423", percentage: 15 },
        { name: "Germany", views: "5,134", percentage: 12 },
        { name: "Canada", views: "4,890", percentage: 10 },
        { name: "Australia", views: "3,412", percentage: 8 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}>
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{label}</p>
                    <p style={{ margin: 0, fontWeight: 600, color: "#10B981" }}>
                        Visitors: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <DashboardLayout pageTitle="Analytics">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Track your business performance and key metrics.
            </p>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {summaryCards.map((card, i) => {
                    const isPositive = card.trend.startsWith("+");
                    const trendColor = (isPositive && !card.isNegativeTrendGood) || (!isPositive && card.isNegativeTrendGood) ? "#10B981" : "#EF4444";

                    return (
                        <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
                                    {card.title}
                                </div>
                                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace", marginBottom: "0.5rem" }}>
                                    {card.value}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: trendColor, fontWeight: 500, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                    {isPositive ? "↗" : "↘"} {card.trend}
                                </div>
                            </div>
                            <div style={{ padding: "0.625rem", borderRadius: "8px", background: `rgba(${card.color === '#10B981' ? '16,185,129' : card.color === '#0EA5E9' ? '14,165,233' : card.color === '#8B5CF6' ? '139,92,246' : '245,158,11'}, 0.1)` }}>
                                <card.icon size={20} color={card.color} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {/* Traffic Trend Chart */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>Page Views Over Time</h3>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Monthly visitor traffic trends</p>
                    </div>
                    <div style={{ height: "300px", width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisitors)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cost by Category Chart */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>Cost by Category</h3>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Distribution across infrastructure services</p>
                    </div>
                    <div style={{ height: "300px", width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={costData}
                                layout="vertical"
                                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                                barSize={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--text-secondary)", fontSize: 12, fontWeight: 500 }}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "8px" }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, "Cost"]}
                                />
                                <Bar dataKey="cost" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                {/* Top Pages Table */}
                <div className="surface" style={{ overflow: "hidden" }}>
                    <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid var(--border)" }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>Top Pages</h3>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Most visited pages this period</p>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th style={{ textAlign: "right" }}>Views</th>
                                    <th style={{ textAlign: "right" }}>Unique</th>
                                    <th style={{ textAlign: "right" }}>Bounce Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topPages.map((page, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>{page.path}</td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{page.views}</td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{page.unique}</td>
                                        <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{page.bounce}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Countries List */}
                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>Top Countries</h3>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Where your visitors come from</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {topCountries.map((country, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
                                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{country.name}</span>
                                    <div style={{ display: "flex", gap: "1rem", fontFamily: "JetBrains Mono, monospace" }}>
                                        <span style={{ color: "var(--text-secondary)" }}>{country.views}</span>
                                        <span style={{ color: "var(--text-muted)", width: "30px", textAlign: "right" }}>{country.percentage}%</span>
                                    </div>
                                </div>
                                <div style={{ height: "6px", background: "var(--bg-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${country.percentage}%`, background: "#10B981", borderRadius: "999px" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsPage;
