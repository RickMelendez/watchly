import React from "react";
import {
    GitBranch,
    CheckCircle2,
    XCircle,
    Loader2,
    Circle,
    Clock
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const PipelinesPage = () => {
    // Mock data based on the Signal Dashboard screenshot
    const pipelines = [
        {
            id: "run-4821", trigger: "push", title: "feat: add real-time server metrics",
            branch: "main", commit: "a1b2c3d", author: "Sarah Kim", initials: "SK", authorColor: "#10B981",
            duration: "4m 32s", timeAgo: "12 min ago",
            steps: [
                { name: "Build", status: "success" },
                { name: "Test", status: "success" },
                { name: "Deploy", status: "success" },
                { name: "Verify", status: "success" },
            ]
        },
        {
            id: "run-4820", trigger: "push", title: "fix: resolve auth timeout issue",
            branch: "hotfix/auth-fix", commit: "c4f5g6h", author: "Alex Chen", initials: "AC", authorColor: "#0EA5E9",
            duration: "3m 18s", timeAgo: "15 min ago",
            steps: [
                { name: "Build", status: "success" },
                { name: "Test", status: "success" },
                { name: "Deploy", status: "running" },
                { name: "Verify", status: "pending" },
            ]
        },
        {
            id: "run-4819", trigger: "PR", title: "chore: update dependencies",
            branch: "main", commit: "i7j8k9l", author: "Jordan Lee", initials: "JL", authorColor: "#8B5CF6",
            duration: "2m 04s", timeAgo: "28 min ago",
            steps: [
                { name: "Build", status: "success" },
                { name: "Test", status: "failed" },
                { name: "Deploy", status: "skipped" },
                { name: "Verify", status: "skipped" },
            ]
        },
        {
            id: "run-4818", trigger: "PR", title: "feat: container health dashboard",
            branch: "feature/containers", commit: "m0n1o2p", author: "Morgan Davis", initials: "MD", authorColor: "#F59E0B",
            duration: "5m 14s", timeAgo: "1h ago",
            steps: [
                { name: "Build", status: "success" },
                { name: "Test", status: "success" },
                { name: "Deploy", status: "success" },
                { name: "Verify", status: "success" },
            ]
        },
        {
            id: "run-4817", trigger: "cron", title: "Scheduled: full regression suite",
            branch: "main", commit: "q3r4s5t", author: "System", initials: "SY", authorColor: "#EF4444",
            duration: "18m 42s", timeAgo: "6h ago",
            steps: [
                { name: "Build", status: "success" },
                { name: "Unit Tests", status: "success" },
                { name: "Integration", status: "success" },
                { name: "E2E", status: "success" },
            ]
        },
        {
            id: "run-4816", trigger: "push", title: "refactor: extract shared utils",
            branch: "main", commit: "u6v7w8x", author: "Riley Park", initials: "RP", authorColor: "#10B981",
            duration: "3m 50s", timeAgo: "8h ago",
            steps: [
                { name: "Build", status: "success" },
                { name: "Test", status: "success" },
                { name: "Deploy", status: "success" },
                { name: "Verify", status: "success" },
            ]
        },
    ];

    const getTriggerStyle = (trigger) => {
        switch (trigger) {
            case "push": return { bg: "rgba(16,185,129,0.15)", color: "#10B981" };
            case "PR": return { bg: "rgba(139,92,246,0.15)", color: "#8B5CF6" };
            case "cron": return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
            default: return { bg: "var(--bg-elevated)", color: "var(--text-secondary)" };
        }
    };

    const renderStepIcon = (status) => {
        switch (status) {
            case "success": return <CheckCircle2 size={18} color="#10B981" />;
            case "failed": return <XCircle size={18} color="#EF4444" />;
            case "running": return <Loader2 size={18} color="#3B82F6" className="animate-spin" />;
            case "skipped":
            case "pending":
            default: return <Circle size={18} color="var(--border)" strokeWidth={2} />;
        }
    };

    return (
        <DashboardLayout pageTitle="CI/CD Pipelines">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Monitor build and deployment workflows
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {pipelines.map((pipeline, i) => {
                    const triggerStyle = getTriggerStyle(pipeline.trigger);

                    return (
                        <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {/* Left Side: Info */}
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        {pipeline.id}
                                    </span>
                                    <span style={{
                                        fontSize: "0.625rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: "4px",
                                        background: triggerStyle.bg, color: triggerStyle.color, textTransform: "uppercase", letterSpacing: "0.05em"
                                    }}>
                                        {pipeline.trigger}
                                    </span>
                                </div>
                                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                    {pipeline.title}
                                </h3>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                        <GitBranch size={14} />
                                        <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{pipeline.branch}</span>
                                        <span style={{ margin: "0 0.25rem", color: "var(--border)" }}>→</span>
                                        <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{pipeline.commit}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <div style={{
                                            width: 18, height: 18, borderRadius: "50%",
                                            background: pipeline.authorColor,
                                            color: "#fff", fontSize: "0.55rem", fontWeight: 700,
                                            display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>
                                            {pipeline.initials}
                                        </div>
                                        <span>{pipeline.author}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Steps & Time */}
                            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
                                {/* Steps */}
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {pipeline.steps.map((step, index) => (
                                        <React.Fragment key={index}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", position: "relative" }}>
                                                {renderStepIcon(step.status)}
                                                <span style={{ fontSize: "0.6875rem", color: step.status === 'pending' || step.status === 'skipped' ? 'var(--text-muted)' : 'var(--text-secondary)', fontWeight: 500 }}>
                                                    {step.name}
                                                </span>
                                            </div>
                                            {index < pipeline.steps.length - 1 && (
                                                <div style={{
                                                    width: "30px", height: "1px",
                                                    background: step.status === 'success' ? "#10B981" : "var(--border)",
                                                    margin: "0 8px 16px 8px"
                                                }} />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Timing */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", minWidth: "80px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                        <Clock size={13} color="var(--text-muted)" />
                                        {pipeline.duration}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                        {pipeline.timeAgo}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
};

export default PipelinesPage;
