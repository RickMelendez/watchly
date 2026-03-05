import React from "react";
import { Package, Play, Square, Cpu, CheckCircle2 } from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const ContainersPage = () => {
    // Mock data based on the Signal Dashboard screenshot

    const summaryCards = [
        { title: "Total Containers", value: "24", icon: Package, color: "#10B981" },
        { title: "Running", value: "19", icon: Play, color: "#10B981" },
        { title: "Stopped", value: "4", icon: Square, color: "#6B7280" },
        { title: "Avg CPU", value: "34%", icon: Cpu, color: "#0EA5E9" },
    ];

    const containers = [
        { name: "api-gateway", image: "nginx:1.25-alpine", status: "Running", cpu: "12%", memory: "128MB / 256MB", ports: "8080:80", uptime: "14d 6h" },
        { name: "auth-service", image: "node:20-slim", status: "Running", cpu: "28%", memory: "256MB / 512MB", ports: "3001:3001", uptime: "14d 6h" },
        { name: "user-service", image: "node:20-slim", status: "Running", cpu: "22%", memory: "192MB / 512MB", ports: "3002:3002", uptime: "14d 6h" },
        { name: "payment-service", image: "node:20-slim", status: "Running", cpu: "35%", memory: "320MB / 512MB", ports: "3003:3003", uptime: "7d 2h" },
        { name: "postgres-primary", image: "postgres:16-alpine", status: "Running", cpu: "45%", memory: "1.2GB / 2GB", ports: "5432:5432", uptime: "30d 1h" },
        { name: "postgres-replica", image: "postgres:16-alpine", status: "Running", cpu: "10%", memory: "800MB / 2GB", ports: "5433:5432", uptime: "30d 1h" },
        { name: "redis-cache", image: "redis:7-alpine", status: "Running", cpu: "8%", memory: "64MB / 256MB", ports: "6379:6379", uptime: "30d 1h" },
        { name: "worker-queue", image: "node:20-slim", status: "Running", cpu: "42%", memory: "384MB / 512MB", ports: "-", uptime: "3d 8h" },
        { name: "log-collector", image: "fluent/fluentd:v1.16", status: "Stopped", cpu: "0%", memory: "0MB / 256MB", ports: "24224:24224", uptime: "-" },
        { name: "metrics-agent", image: "prom/node-exporter:latest", status: "Restarting", cpu: "5%", memory: "32MB / 128MB", ports: "9100:9100", uptime: "0d 0h" },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Running": return { bg: "rgba(16,185,129,1)", color: "#fff" };
            case "Restarting": return { bg: "rgba(245,158,11,1)", color: "#fff" };
            case "Stopped": return { bg: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" };
            default: return { bg: "var(--bg-elevated)", color: "var(--text-secondary)" };
        }
    };

    return (
        <DashboardLayout pageTitle="Containers">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Overview of running containers and resource usage
            </p>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {summaryCards.map((card, i) => (
                    <div key={i} className="surface" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ padding: "0.625rem", borderRadius: "8px", background: `rgba(${card.color === '#10B981' ? '16,185,129' : card.color === '#0EA5E9' ? '14,165,233' : '107,114,128'}, 0.1)` }}>
                            <card.icon size={20} color={card.color} strokeWidth={2} />
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

            {/* Containers Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Container Instances</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table" style={{ minWidth: "900px" }}>
                        <thead>
                            <tr>
                                <th>Container</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th>CPU</th>
                                <th>Memory</th>
                                <th>Ports</th>
                                <th>Uptime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {containers.map((container, i) => {
                                const statusStyle = getStatusStyle(container.status);
                                return (
                                    <tr key={i}>
                                        <td style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                            <CheckCircle2 size={14} color={container.status === 'Running' ? "#10B981" : (container.status === 'Stopped' ? "var(--text-muted)" : "#F59E0B")} />
                                            {container.name}
                                        </td>
                                        <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                            {container.image}
                                        </td>
                                        <td>
                                            <span style={{
                                                fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "99px",
                                                background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border,
                                            }}>
                                                {container.status}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                            {container.cpu}
                                        </td>
                                        <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                                            {container.memory.split("/")[0]} <span style={{ color: "var(--text-muted)" }}>/ {container.memory.split("/")[1]}</span>
                                        </td>
                                        <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                            {container.ports}
                                        </td>
                                        <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                                            {container.uptime}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ContainersPage;
