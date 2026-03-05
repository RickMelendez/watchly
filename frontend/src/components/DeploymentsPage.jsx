import React from "react";
import { Rocket, CheckCircle2, Clock, RotateCcw, GitMerge, GitPullRequest } from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const DeploymentsPage = () => {
    // Mock data based directly on the "Deployments" screenshot provided by the user

    const summaryCards = [
        { title: "Today's Deploys", value: "18", icon: Rocket, color: "#10B981" },
        { title: "Success Rate", value: "94.2%", icon: CheckCircle2, color: "#10B981" },
        { title: "Avg Duration", value: "3m 24s", icon: Clock, color: "#3B82F6" },
        { title: "Rollbacks", value: "2", icon: RotateCcw, color: "#F59E0B" },
    ];

    const deployments = [
        { service: "api-gateway", version: "v2.14.0", commit: "a1b2c3d", branch: "main", env: "production", status: "Success", duration: "2m 18s", deployedBy: "Sarah Kim", initials: "SK", time: "2 min ago" },
        { service: "auth-service", version: "v1.8.3", commit: "c4f5g6h", branch: "hotfix/auth-fix", env: "production", status: "Rolling", duration: "1m 42s", deployedBy: "Alex Chen", initials: "AC", time: "5 min ago" },
        { service: "web-frontend", version: "v3.2.1", commit: "i7j8k9l", branch: "main", env: "production", status: "Success", duration: "4m 52s", deployedBy: "Jordan Lee", initials: "JL", time: "18 min ago" },
        { service: "payment-service", version: "v2.1.0", commit: "m0n1o2p", branch: "release/2.1", env: "staging", status: "Success", duration: "3m 05s", deployedBy: "Morgan Davis", initials: "MD", time: "32 min ago" },
        { service: "notification-svc", version: "v1.4.7", commit: "q3r4s5t", branch: "main", env: "production", status: "Failed", duration: "1m 12s", deployedBy: "Riley Park", initials: "RP", time: "45 min ago" },
        { service: "user-service", version: "v2.9.0", commit: "u6v7w8x", branch: "feature/profiles", env: "development", status: "Success", duration: "2m 38s", deployedBy: "Casey Wong", initials: "CW", time: "1h ago" },
        { service: "search-service", version: "v1.2.4", commit: "y9z0a1b", branch: "main", env: "staging", status: "Success", duration: "5m 14s", deployedBy: "Sarah Kim", initials: "SK", time: "1.5h ago" },
        { service: "api-gateway", version: "v2.13.9", commit: "c2d3e4f", branch: "main", env: "production", status: "Success", duration: "2m 22s", deployedBy: "Alex Chen", initials: "AC", time: "2h ago" },
        { service: "worker-queue", version: "v1.6.2", commit: "g5h6i7j", branch: "main", env: "production", status: "Cancelled", duration: "0m 48s", deployedBy: "Jordan Lee", initials: "JL", time: "3h ago" },
        { service: "metrics-collector", version: "v1.1.0", commit: "k8l9m0n", branch: "release/1.1", env: "staging", status: "Success", duration: "3m 44s", deployedBy: "Morgan Davis", initials: "MD", time: "4h ago" },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Success": return { bg: "rgba(16,185,129,1)", color: "#fff" };
            case "Rolling": return { bg: "rgba(245,158,11,1)", color: "#fff" };
            case "Failed": return { bg: "rgba(239,68,68,1)", color: "#fff" };
            case "Cancelled": return { bg: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" };
            default: return { bg: "var(--bg-elevated)", color: "var(--text-secondary)" };
        }
    };

    return (
        <DashboardLayout pageTitle="Deployments">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Track and manage service deployments across environments
            </p>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {summaryCards.map((card, i) => (
                    <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ padding: "0.625rem", borderRadius: "8px", background: `rgba(${card.color === '#10B981' ? '16,185,129' : card.color === '#3B82F6' ? '59,130,246' : '245,158,11'}, 0.1)` }}>
                            <card.icon size={20} color={card.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>
                                {card.title}
                            </div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                {card.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Deployments Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Deployment History</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table" style={{ minWidth: "900px" }}>
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
                            </tr>
                        </thead>
                        <tbody>
                            {deployments.map((dep, i) => {
                                const statusStyle = getStatusStyle(dep.status);
                                return (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                            {dep.service}
                                        </td>
                                        <td style={{ fontFamily: "JetBrains Mono, monospace" }}>
                                            {dep.version} <span style={{ color: "var(--text-muted)" }}>~ {dep.commit}</span>
                                        </td>
                                        <td style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                            {dep.branch.includes("hotfix") || dep.branch.includes("feature") ? <GitPullRequest size={13} /> : <GitMerge size={13} />}
                                            {dep.branch}
                                        </td>
                                        <td>
                                            <span style={{
                                                fontSize: "0.6875rem", fontWeight: 600, padding: "0.15rem 0.4rem", borderRadius: "4px",
                                                background: dep.env === "production" ? "rgba(16,185,129,0.1)" : (dep.env === "staging" ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)"),
                                                color: dep.env === "production" ? "#10B981" : (dep.env === "staging" ? "#3B82F6" : "#8B5CF6"),
                                                textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace"
                                            }}>
                                                {dep.env}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "99px",
                                                background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border,
                                                display: "inline-flex", alignItems: "center", gap: "0.25rem"
                                            }}>
                                                {dep.status === "Success" && <CheckCircle2 size={10} />}
                                                {dep.status === "Failed" && <span style={{ fontSize: "10px" }}>×</span>}
                                                {dep.status}
                                            </span>
                                        </td>
                                        <td style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                            <Clock size={13} /> {dep.duration}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <div style={{
                                                    width: 20, height: 20, borderRadius: "50%",
                                                    background: `hsl(${Math.random() * 360}, 70%, 40%)`,
                                                    color: "#fff", fontSize: "0.6rem", fontWeight: 600,
                                                    display: "flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    {dep.initials}
                                                </div>
                                                <span style={{ fontSize: "0.8125rem", color: "var(--text-primary)" }}>{dep.deployedBy}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                            {dep.time}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DeploymentsPage;
