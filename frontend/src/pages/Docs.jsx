import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, Bell, Shield, Terminal, Server, Rocket,
  GitBranch, FileText, BarChart2, Lock, ArrowRight, ChevronRight
} from "lucide-react";

const SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    icon: Activity,
  },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Terminal,
  },
  {
    id: "websites",
    label: "Website Monitoring",
    icon: Activity,
  },
  {
    id: "alerts",
    label: "Alerts & Incidents",
    icon: Bell,
  },
  {
    id: "pipelines",
    label: "CI/CD Pipelines",
    icon: GitBranch,
  },
  {
    id: "containers",
    label: "Containers",
    icon: Server,
  },
  {
    id: "deployments",
    label: "Deployments",
    icon: Rocket,
  },
  {
    id: "logs",
    label: "Log Explorer",
    icon: FileText,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart2,
  },
  {
    id: "api",
    label: "REST API",
    icon: Lock,
  },
];

const content = {
  overview: {
    title: "Watchly Overview",
    body: (
      <div>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Watchly is a full-stack developer monitoring platform. It gives you real-time visibility into your websites, infrastructure, deployments, and security posture — all in a single dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Activity, title: "Uptime Monitoring", desc: "Track response times and availability across all your websites." },
            { icon: Bell, title: "Instant Alerts", desc: "Receive alerts the moment a service degrades or goes offline." },
            { icon: GitBranch, title: "Pipeline Tracking", desc: "Monitor CI/CD pipelines and deployment status in real time." },
            { icon: Shield, title: "Security Monitoring", desc: "Detect threats, SSL expiry, and suspicious access patterns." },
            { icon: FileText, title: "Log Explorer", desc: "Search and filter logs across all your services." },
            { icon: BarChart2, title: "Analytics", desc: "30-day performance trends, uptime percentages, and response benchmarks." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 rounded-xl border border-green-500/10 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} className="text-green-400" />
                <span className="text-white text-sm font-semibold">{title}</span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "getting-started": {
    title: "Getting Started",
    body: (
      <div className="space-y-6">
        <p className="text-white/60 text-sm leading-relaxed">
          Getting up and running with Watchly takes less than two minutes.
        </p>
        {[
          { step: "01", title: "Create an account", desc: "Sign up at the login page. Authentication is handled via JWT tokens — no third-party OAuth required." },
          { step: "02", title: "Add your first website", desc: 'Navigate to Websites in the dashboard sidebar. Click "Add Website", enter the URL and a friendly name, then save.' },
          { step: "03", title: "Configure alerts", desc: "From the Alerts page, you can set thresholds for response time and downtime. Alerts are triggered automatically by the monitoring engine." },
          { step: "04", title: "Explore the dashboard", desc: "The main dashboard shows live uptime status, recent incidents, and system health across all monitored services." },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-xs font-mono font-bold">{step}</span>
            </div>
            <div>
              <div className="text-white text-sm font-semibold mb-1">{title}</div>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  websites: {
    title: "Website Monitoring",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          Watchly monitors your websites at configurable intervals, recording HTTP status codes and response times on every check.
        </p>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-white/60 font-medium text-xs">Field</th>
                <th className="text-left px-4 py-3 text-white/60 font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Name", "Friendly label for the website (e.g. Production API)"],
                ["URL", "The full URL to monitor, including protocol (https://)"],
                ["Check Interval", "How often Watchly polls the URL (default: 30 seconds)"],
                ["Status", "Current state: Online, Offline, or Degraded"],
                ["Response Time", "Last recorded HTTP response time in milliseconds"],
                ["Uptime %", "Rolling percentage of successful checks over 30 days"],
              ].map(([field, desc]) => (
                <tr key={field} className="border-b border-white/5">
                  <td className="px-4 py-3 text-green-400 font-mono text-xs">{field}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  alerts: {
    title: "Alerts & Incidents",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          Alerts are generated automatically when a monitored service fails a check. Incidents aggregate related alerts into a single timeline view.
        </p>
        <div className="space-y-3">
          {[
            { severity: "Critical", color: "#ef4444", desc: "Site is down or returning 5xx errors. Immediate attention required." },
            { severity: "Warning", color: "#f59e0b", desc: "Response time exceeds threshold or site is intermittently slow." },
            { severity: "Info", color: "#3b82f6", desc: "Non-critical notices, configuration changes, or recoveries." },
          ].map(({ severity, color, desc }) => (
            <div key={severity} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <div>
                <span className="text-white text-sm font-semibold">{severity} — </span>
                <span className="text-white/50 text-sm">{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs mt-2">
          Use the Resolve button on any alert to mark it as handled. Resolved alerts remain in history for audit purposes.
        </p>
      </div>
    ),
  },
  pipelines: {
    title: "CI/CD Pipelines",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          The Pipelines view tracks the status of your CI/CD runs. Each pipeline entry shows its current stage, branch, duration, and outcome.
        </p>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-white/60 font-medium text-xs">Status</th>
                <th className="text-left px-4 py-3 text-white/60 font-medium text-xs">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["running", "Pipeline is actively executing stages"],
                ["success", "All stages completed without errors"],
                ["failed", "One or more stages returned a non-zero exit"],
                ["pending", "Queued, waiting for a runner to pick it up"],
                ["cancelled", "Pipeline was manually stopped"],
              ].map(([status, meaning]) => (
                <tr key={status} className="border-b border-white/5">
                  <td className="px-4 py-3 text-green-400 font-mono text-xs">{status}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  containers: {
    title: "Containers",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          The Containers page shows all registered container instances, their runtime status, CPU/memory usage, and image metadata.
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          Containers in a <span className="text-green-400 font-mono">running</span> state are healthy. Containers in <span className="text-red-400 font-mono">stopped</span> or <span className="text-yellow-400 font-mono">error</span> state will appear highlighted for immediate attention.
        </p>
      </div>
    ),
  },
  deployments: {
    title: "Deployments",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          Deployments track individual release events across your services. Each entry records the service name, version, environment, deployer, and outcome.
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          You can filter by environment (production, staging, development) and status (success, failed, in-progress) to quickly find the root cause of a regression.
        </p>
      </div>
    ),
  },
  logs: {
    title: "Log Explorer",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          The Log Explorer lets you search and filter structured log entries across all services in real time.
        </p>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-white/60 font-medium text-xs">Level</th>
                <th className="text-left px-4 py-3 text-white/60 font-medium text-xs">Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["DEBUG", "Verbose output for development and troubleshooting"],
                ["INFO", "Normal operational events and state transitions"],
                ["WARN", "Non-fatal issues that warrant investigation"],
                ["ERROR", "Failures that impacted a request or process"],
              ].map(([level, use]) => (
                <tr key={level} className="border-b border-white/5">
                  <td className="px-4 py-3 text-green-400 font-mono text-xs">{level}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  security: {
    title: "Security",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          The Security page aggregates security events across your monitored infrastructure, including failed logins, SSL certificate warnings, and suspicious traffic patterns.
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          Events are classified by severity and source service. Critical events are surfaced immediately in the dashboard alert count.
        </p>
      </div>
    ),
  },
  analytics: {
    title: "Analytics",
    body: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm leading-relaxed">
          The Analytics page provides aggregated performance data over the last 30 days.
        </p>
        <div className="space-y-2">
          {[
            ["Total Checks", "Cumulative number of uptime checks run across all websites"],
            ["Avg Response Time", "Mean HTTP response time across all checks in the period"],
            ["Uptime %", "Ratio of successful checks to total checks, expressed as a percentage"],
            ["Total Alerts", "Number of alert events triggered in the selected period"],
          ].map(([metric, desc]) => (
            <div key={metric} className="flex gap-3 p-3 rounded-lg border border-white/5 bg-white/5">
              <span className="text-green-400 font-mono text-xs w-36 flex-shrink-0">{metric}</span>
              <span className="text-white/50 text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  api: {
    title: "REST API",
    body: (
      <div className="space-y-6">
        <p className="text-white/60 text-sm leading-relaxed">
          Watchly exposes a REST API for all dashboard features. All endpoints require a valid JWT in the <span className="text-green-400 font-mono">Authorization: Bearer &lt;token&gt;</span> header.
        </p>
        <div>
          <div className="text-white/40 text-xs uppercase tracking-widest mb-2">Base URL</div>
          <div className="font-mono text-xs bg-black border border-green-500/20 rounded-lg px-4 py-3 text-green-400">
            https://your-backend.domain.com/api
          </div>
          <p className="text-white/30 text-xs mt-2">Replace with your actual backend deployment URL.</p>
        </div>
        <div className="space-y-2">
          {[
            ["GET", "/websites", "List all monitored websites"],
            ["POST", "/websites", "Add a new website to monitor"],
            ["DELETE", "/websites/:id", "Remove a website"],
            ["GET", "/alerts", "List all alerts"],
            ["PATCH", "/alerts/:id", "Update alert status (e.g. resolve)"],
            ["GET", "/logs", "Fetch log entries with optional level/search filters"],
            ["POST", "/logs", "Write a new log entry"],
            ["GET", "/analytics/summary", "Get 30-day performance summary"],
            ["GET", "/metrics/:websiteId", "Get uptime metrics for a specific website"],
          ].map(([method, path, desc]) => (
            <div key={path} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/5">
              <span className={`font-mono text-xs font-bold flex-shrink-0 w-12 ${method === "GET" ? "text-green-400" : method === "POST" ? "text-blue-400" : method === "DELETE" ? "text-red-400" : "text-yellow-400"}`}>
                {method}
              </span>
              <span className="font-mono text-xs text-white/70 flex-shrink-0 w-48">{path}</span>
              <span className="text-white/40 text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export default function Docs() {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  const current = content[active];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          <span className="text-green-400 font-mono font-bold text-base">W</span>
          Watchly
        </button>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          Open Dashboard
          <ArrowRight size={14} />
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 border-r border-white/10 py-6 px-3 hidden md:block">
          <div className="text-white/30 text-xs uppercase tracking-widest font-medium px-3 mb-3">Documentation</div>
          <nav className="space-y-0.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  active === id
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={13} />
                {label}
                {active === id && <ChevronRight size={12} className="ml-auto" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full border-b border-white/10 px-4 py-3 flex gap-2 overflow-x-auto">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active === id
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "text-white/50 hover:text-white border border-transparent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 px-8 py-10 max-w-3xl">
          <h1 className="text-2xl font-bold text-white mb-6">{current.title}</h1>
          {current.body}
        </main>
      </div>
    </div>
  );
}
