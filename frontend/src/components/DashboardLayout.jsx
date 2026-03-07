import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Globe,
    LayoutDashboard,
    Bell,
    LogOut,
    Activity,
    ChevronRight,
    RefreshCw,
    Terminal,
    Server,
    Rocket,
    AlertTriangle,
    FileText,
    GitBranch,
    Shield,
} from "lucide-react";


const NAV = [
    {
        group: "OVERVIEW",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        ],
    },
    {
        group: "INFRASTRUCTURE",
        items: [
            { label: "Websites", icon: Globe, path: "/dashboard/websites" },
            { label: "Containers", icon: Server, path: "/dashboard/containers" },
            { label: "Uptime", icon: Activity, path: "/dashboard/uptime" },
        ],
    },
    {
        group: "OPERATIONS",
        items: [
            { label: "Deployments", icon: Rocket, path: "/dashboard/deployments" },
            { label: "Pipelines", icon: GitBranch, path: "/dashboard/pipelines" },
            { label: "Incidents", icon: AlertTriangle, path: "/dashboard/incidents" },
            { label: "Logs", icon: FileText, path: "/dashboard/logs" },
            { label: "API Monitoring", icon: Activity, path: "/dashboard/api-monitoring" },
            { label: "Security", icon: Shield, path: "/dashboard/security" },
        ],
    },
    {
        group: "INSIGHTS",
        items: [
            { label: "Analytics", icon: Activity, path: "/dashboard/analytics" },
        ],
    },
];

export default function DashboardLayout({
    children,
    pageTitle = "Dashboard",
    alertCount = 0,
    refreshing = false,
    onRefresh,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    // Sidebar state was extracted but not used internally

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const userEmail = (() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return "user@watchly.io";
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.sub || payload.email || "user@watchly.io";
        } catch {
            return "user@watchly.io";
        }
    })();

    return (
        <div className="dashboard-layout">
            {/* ── Sidebar ───────────────────────────────────── */}
            <aside className="dashboard-sidebar">
                {/* Logo */}
                <div
                    style={{
                        padding: "1rem 1rem 0.75rem",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            background: "var(--accent-dim)",
                            border: "1px solid rgba(34,197,94,0.3)",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Terminal size={14} color="#22c55e" />
                    </div>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "var(--text-primary)",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Watchly
                    </span>
                    <span
                        style={{
                            marginLeft: "auto",
                            fontSize: "0.6rem",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "#22c55e",
                            background: "rgba(34,197,94,0.1)",
                            border: "1px solid rgba(34,197,94,0.2)",
                            padding: "0.1rem 0.35rem",
                            borderRadius: 3,
                        }}
                    >
                        v1.0
                    </span>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "0.75rem 0.625rem", overflowY: "auto" }}>
                    {NAV.map(({ group, items }) => (
                        <div key={group} style={{ marginBottom: "1.25rem" }}>
                            <div
                                style={{
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.12em",
                                    color: "var(--text-muted)",
                                    padding: "0 0.375rem 0.4rem",
                                    textTransform: "uppercase",
                                }}
                            >
                                {group}
                            </div>
                            {items.map(({ label, icon: Icon, path }) => {
                                const isActive = location.pathname === path;
                                return (
                                    <button
                                        key={label}
                                        className={`sidebar-link${isActive ? " active" : ""}`}
                                        style={{ width: "100%", textAlign: "left", background: "none" }}
                                        onClick={() => navigate(path)}
                                    >
                                        <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                                        <span>{label}</span>
                                        {isActive && (
                                            <ChevronRight
                                                size={12}
                                                style={{ marginLeft: "auto", color: "#22c55e" }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom User */}
                <div
                    style={{
                        borderTop: "1px solid var(--border)",
                        padding: "0.75rem 0.625rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "rgba(34,197,94,0.15)",
                                border: "1px solid rgba(34,197,94,0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: "#22c55e",
                                flexShrink: 0,
                            }}
                        >
                            {userEmail[0].toUpperCase()}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <div
                                style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    color: "var(--text-primary)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {userEmail}
                            </div>
                            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                                Admin
                            </div>
                        </div>
                    </div>
                    <button
                        className="sidebar-link"
                        style={{ width: "100%", textAlign: "left", background: "none", color: "#ef4444" }}
                        onClick={handleLogout}
                    >
                        <LogOut size={13} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ── Main ──────────────────────────────────────── */}
            <div className="dashboard-main">
                {/* Topbar */}
                <header className="dashboard-topbar">
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "var(--text-primary)",
                            }}
                        >
                            {pageTitle}
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {/* Live indicator */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                fontSize: "0.6875rem",
                                color: "var(--text-muted)",
                                fontFamily: "JetBrains Mono, monospace",
                            }}
                        >
                            <span className="live-dot" />
                            LIVE
                        </div>

                        {/* Refresh */}
                        {onRefresh && (
                            <button
                                className="btn-ghost"
                                onClick={onRefresh}
                                disabled={refreshing}
                                style={{ padding: "0.3rem 0.5rem" }}
                            >
                                <RefreshCw
                                    size={13}
                                    style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}
                                />
                            </button>
                        )}

                        {/* Alerts bell */}
                        <button
                            className="btn-ghost"
                            onClick={() => navigate("/dashboard/alerts")}
                            style={{ padding: "0.3rem 0.5rem", position: "relative" }}
                        >
                            <Bell size={14} />
                            {alertCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-4px",
                                        right: "-4px",
                                        width: 16,
                                        height: 16,
                                        background: "#ef4444",
                                        borderRadius: "50%",
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {alertCount > 9 ? "9+" : alertCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
}
