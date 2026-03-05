import React, { useState } from "react";
import { Search } from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const LogsPage = () => {
    // Mock data based on the Signal Dashboard screenshot
    const allLogs = [
        { timestamp: "2026-02-27 14:25:12.348", level: "INFO", service: "api-gateway", message: "GET /api/v2/users 200 OK - 45ms" },
        { timestamp: "2026-02-27 14:25:11.892", level: "ERROR", service: "auth-service", message: "Connection pool exhausted, waiting for available connection" },
        { timestamp: "2026-02-27 14:25:11.445", level: "WARN", service: "payment-service", message: "Rate limit exceeded for IP 203.0.113.42 (429)" },
        { timestamp: "2026-02-27 14:25:10.998", level: "INFO", service: "api-gateway", message: "POST /api/v2/orders 201 Created - 128ms" },
        { timestamp: "2026-02-27 14:25:10.221", level: "DEBUG", service: "worker-queue", message: "Processing job batch #4821 - 12 items queued" },
        { timestamp: "2026-02-27 14:25:09.876", level: "INFO", service: "web-frontend", message: "TLS handshake completed with upstream proxy" },
        { timestamp: "2026-02-27 14:25:09.334", level: "ERROR", service: "postgres-primary", message: "FATAL: remaining connection slots reserved for superuser" },
        { timestamp: "2026-02-27 14:25:08.712", level: "INFO", service: "redis-cache", message: "Cache miss for key: session:usr_a8f2c4 - fetching from source" },
        { timestamp: "2026-02-27 14:25:08.198", level: "WARN", service: "metrics-agent", message: "Scrape target prod-worker-01:9100 unreachable - timeout after 5s" },
        { timestamp: "2026-02-27 14:25:07.645", level: "INFO", service: "api-gateway", message: "GET /api/v2/products?category=electronics 200 OK - 67ms" },
        { timestamp: "2026-02-27 14:25:07.182", level: "INFO", service: "auth-service", message: "JWT token refreshed for user usr_7d92f1 - expires in 3600s" },
        { timestamp: "2026-02-27 14:25:06.558", level: "DEBUG", service: "log-collector", message: "Flushing buffer - 2,847 events written to storage" },
        { timestamp: "2026-02-27 14:25:06.014", level: "ERROR", service: "payment-service", message: "Stripe webhook signature verification failed - event evt_1xbc2dt" },
        { timestamp: "2026-02-27 14:25:05.471", level: "INFO", service: "api-gateway", message: "DELETE /api/v2/sessions/sess_x9k2 204 No Content - 12ms" },
        { timestamp: "2026-02-27 14:25:04.927", level: "WARN", service: "worker-queue", message: "Job retry #3 for email:send - previous attempt failed with ECONNRESET" },
        { timestamp: "2026-02-27 14:25:04.303", level: "INFO", service: "search-service", message: "Elasticsearch index rebuilt - 142,847 documents indexed in 4.2s" },
        { timestamp: "2026-02-27 14:25:03.839", level: "INFO", service: "api-gateway", message: "PATCH /api/v2/users/usr_3fb8 200 OK - 34ms" },
        { timestamp: "2026-02-27 14:25:03.295", level: "DEBUG", service: "postgres-replica", message: "Replication lag: 0.3s - within acceptable threshold" },
        { timestamp: "2026-02-27 14:25:02.751", level: "ERROR", service: "notification-svc", message: "FCM push notification delivery failed - InvalidRegistration for device tok_9x2m" },
    ];

    const [activeTab, setActiveTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = ["ALL", "DEBUG", "INFO", "WARN", "ERROR"];

    const getLevelStyle = (level) => {
        switch (level) {
            case "INFO": return { bg: "rgba(16,185,129,0.15)", color: "#10B981" };
            case "ERROR": return { bg: "rgba(239,68,68,0.15)", color: "#EF4444" };
            case "WARN": return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
            case "DEBUG": return { bg: "var(--bg-elevated)", color: "var(--text-secondary)" };
            default: return { bg: "var(--bg-elevated)", color: "var(--text-secondary)" };
        }
    };

    const filteredLogs = allLogs.filter(log => {
        const matchesLevel = activeTab === "ALL" || log.level === activeTab;
        const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.service.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLevel && matchesSearch;
    });

    return (
        <DashboardLayout pageTitle="Log Explorer">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Search and filter logs across all services
            </p>

            <div className="surface" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
                {/* Toolbar */}
                <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Search */}
                    <div style={{ flex: 1, position: "relative" }}>
                        <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                padding: "0.625rem 1rem 0.625rem 2.5rem",
                                color: "var(--text-primary)",
                                fontSize: "0.875rem",
                                outline: "none"
                            }}
                        />
                    </div>

                    {/* Level Tabs */}
                    <div style={{ display: "flex", background: "var(--bg-elevated)", padding: "0.25rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "0.4rem 0.75rem",
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
                                    background: activeTab === tab ? "var(--border)" : "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Log List */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
                    {filteredLogs.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {filteredLogs.map((log, i) => {
                                const levelStyle = getLevelStyle(log.level);
                                // Make the text color slightly tinted based on the error level for the message
                                const messageColor = log.level === 'ERROR' ? '#EF4444' : log.level === 'WARN' ? '#FCD34D' : log.level === 'DEBUG' ? 'var(--text-muted)' : 'var(--text-secondary)';

                                return (
                                    <div
                                        key={i}
                                        style={{
                                            padding: "0.625rem 1.5rem",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "1rem",
                                            borderBottom: "1px solid rgba(255,255,255,0.02)",
                                            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                                            fontFamily: "JetBrains Mono, monospace"
                                        }}
                                    >
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "0.1rem" }}>
                                            {log.timestamp}
                                        </div>
                                        <div style={{ width: "60px", flexShrink: 0 }}>
                                            <span style={{
                                                fontSize: "0.625rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: "4px",
                                                background: levelStyle.bg, color: levelStyle.color,
                                                display: "inline-block", textAlign: "center", width: "100%"
                                            }}>
                                                {log.level}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "0.1rem" }}>
                                            [{log.service}]
                                        </div>
                                        <div style={{ fontSize: "0.8125rem", color: messageColor, wordBreak: "break-all", lineHeight: 1.5 }}>
                                            {log.message}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                            No logs found matching your filters.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LogsPage;
