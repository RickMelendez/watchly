import React from "react";
import DashboardLayout from "./DashboardLayout";
import { Shield, FileText, CheckCircle2 } from "lucide-react";

const SecurityPage = () => {
    return (
        <DashboardLayout pageTitle="Security Audit">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Vulnerability scanning and compliance scores
            </p>

            {/* Score Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                <div className="surface" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "4px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#10B981" }}>A+</span>
                    </div>
                    <div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>Overall Security Score</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>98 / 100</div>
                    </div>
                </div>

                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <Shield size={18} color="#3B82F6" />
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Vulnerabilities</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#EF4444" }}>0</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Critical</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#F59E0B" }}>2</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>High</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>14</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Low</div>
                        </div>
                    </div>
                </div>

                <div className="surface" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <FileText size={18} color="#10B981" />
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Compliance</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                            <span style={{ color: "var(--text-secondary)" }}>SOC2 Type II</span>
                            <span style={{ color: "#10B981", display: "flex", alignItems: "center", gap: "0.25rem" }}><CheckCircle2 size={12} /> Passed</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                            <span style={{ color: "var(--text-secondary)" }}>GDPR</span>
                            <span style={{ color: "#10B981", display: "flex", alignItems: "center", gap: "0.25rem" }}><CheckCircle2 size={12} /> Compliant</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                            <span style={{ color: "var(--text-secondary)" }}>HIPAA</span>
                            <span style={{ color: "var(--text-muted)" }}>Not evaluated</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Findings Table */}
            <div className="surface" style={{ overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>Recent Findings</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Severity</th>
                                <th>Vulnerability</th>
                                <th>Resource</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Last Detected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { sev: "High", vuln: "Outdated OpenSSL Version (CVE-2023-1245)", res: "container/api-gateway", status: "Open", time: "2 hrs ago" },
                                { sev: "High", vuln: "Missing Security Headers (HSTS)", res: "ingress/frontend", status: "In Progress", time: "1 day ago" },
                                { sev: "Medium", vuln: "Permissive CORS Policy", res: "api/user-service", status: "Open", time: "3 days ago" },
                            ].map((item, i) => (
                                <tr key={i}>
                                    <td>
                                        <span style={{
                                            fontSize: "0.6875rem", fontWeight: 600, padding: "0.15rem 0.4rem", borderRadius: "4px",
                                            background: item.sev === 'High' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                                            color: item.sev === 'High' ? '#F59E0B' : '#3B82F6',
                                            textTransform: "uppercase"
                                        }}>
                                            {item.sev}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{item.vuln}</td>
                                    <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>{item.res}</td>
                                    <td>
                                        <span style={{ color: item.status === 'Open' ? '#EF4444' : '#3B82F6', fontSize: "0.8125rem" }}>{item.status}</span>
                                    </td>
                                    <td style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.8125rem" }}>{item.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SecurityPage;
