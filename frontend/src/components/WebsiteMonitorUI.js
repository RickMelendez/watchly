import React, { useState, useEffect, useRef, useCallback } from "react";
import { Globe, Activity, Clock, AlertTriangle, Zap, Plus } from "lucide-react";

import DashboardLayout from "./DashboardLayout";
import StatsGrid from "./StatsGrid";
import WebsitesTable from "./WebsitesTable";
import useWebsites from "../hooks/useWebsites";
import api from "../services/api";
import { fetchWebsiteMetrics, addWebsite as apiAddWebsite, deleteWebsite } from "../services/api";

export default function WebsiteMonitorUI() {
  const { websites, setWebsites, loading: initialLoading, fetchWebsites } = useWebsites();
  const [uptimePercentage, setUptimePercentage] = useState("0.0");
  const [averageResponseTime, setAverageResponseTime] = useState("0.0");
  const [selectedFrequency, setSelectedFrequency] = useState(60);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(0);
  // notifications removed
  const [formError, setFormError] = useState("");
  // statusLoading removed
  const [refreshing, setRefreshing] = useState(false);

  const websitesRef = useRef(websites);
  const intervalRef = useRef(null);

  useEffect(() => { websitesRef.current = websites; }, [websites]);

  /* ── Alerts polling ──────────────────────────────── */
  const fetchActiveAlerts = useCallback(async () => {
    try {
      const res = await api.get("/alerts?status=unresolved");
      setActiveAlerts(res.data.length);
    } catch { }
  }, []);

  useEffect(() => {
    fetchActiveAlerts();
    const id = setInterval(fetchActiveAlerts, 10000);
    return () => clearInterval(id);
  }, [fetchActiveAlerts]);

  /* ── Status polling ──────────────────────────────── */
  const fetchStatuses = useCallback(async () => {
    const current = websitesRef.current;
    if (current.length === 0) return;
    // statusLoading(true) removed
    setRefreshing(true);
    try {
      const updated = await Promise.all(
        current.map(async (site) => {
          if (!site.id) return { ...site, numericUptime: 0, numericResponseTime: 0, uptime: "0%", response_time: "N/A", isDown: true };
          try {
            const m = await fetchWebsiteMetrics(site.id);
            const nu = parseFloat(m.uptime ?? 0);
            const nr = parseFloat(m.response_time ?? 0);
            return {
              ...site,
              numericUptime: nu,
              numericResponseTime: nr,
              uptime: `${(nu * 100).toFixed(1)}%`,
              response_time: nr > 0 ? nr.toFixed(2) : "N/A",
              isDown: nu < 0.5,
            };
          } catch {
            return { ...site, numericUptime: 0, numericResponseTime: 0, uptime: "0.0%", response_time: "N/A", isDown: true };
          }
        })
      );
      setWebsites(updated);
      const valid = updated.filter((s) => !isNaN(s.numericUptime));
      const avg = valid.length ? ((valid.reduce((s, x) => s + x.numericUptime, 0) / valid.length) * 100).toFixed(1) : "0.0";
      setUptimePercentage(avg);
      const validRt = updated.filter((s) => !isNaN(s.numericResponseTime) && s.numericResponseTime > 0);
      const avgRt = validRt.length ? (validRt.reduce((s, x) => s + x.numericResponseTime, 0) / validRt.length).toFixed(2) : "0.0";
      setAverageResponseTime(avgRt);
    } catch { }
    finally {
      // statusLoading(false) removed
      setRefreshing(false);
    }
  }, [setWebsites]);

  useEffect(() => {
    fetchStatuses();
    intervalRef.current = setInterval(fetchStatuses, 10000);
    return () => clearInterval(intervalRef.current);
  }, [fetchStatuses]);

  /* ── Add website ──────────────────────────────────── */
  const isValidUrl = (u) => { try { new URL(u); return true; } catch { return false; } };

  const handleAddWebsite = async (e) => {
    e.preventDefault();
    if (!isValidUrl(url)) { setFormError("Please enter a valid URL (e.g. https://example.com)"); return; }
    setLoading(true);
    setFormError("");
    try {
      await apiAddWebsite({ url, name: url, frequency: selectedFrequency });
      fetchWebsites();
      setUrl("");
    } catch {
      setFormError("Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeWebsite = async (id) => {
    try { await deleteWebsite(id); fetchWebsites(); } catch { }
  };

  /* ── Stats config ────────────────────────────────── */
  const stats = [
    { icon: Globe, title: "Websites Monitored", value: websites.length, color: "text-blue-400" },
    { icon: Activity, title: "Uptime", value: `${uptimePercentage}%` },
    { icon: Clock, title: "Avg Response Time", value: `${averageResponseTime} ms` },
    { icon: AlertTriangle, title: "Active Alerts", value: activeAlerts },
  ];

  /* ── Loading screen ──────────────────────────────── */
  if (initialLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 36, height: 36, border: "2px solid var(--border)", borderTopColor: "#22c55e",
            borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem"
          }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", fontFamily: "JetBrains Mono, monospace" }}>
            Fetching monitoring data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      alertCount={activeAlerts}
      refreshing={refreshing}
      onRefresh={fetchStatuses}
    >
      {/* ── Stats ──────────────────────────────────── */}
      <StatsGrid stats={stats} />

      {/* ── Add Website ────────────────────────────── */}
      <div
        className="surface"
        style={{ padding: "1.25rem", marginBottom: "1rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
          <Zap size={14} color="#22c55e" />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Add Website to Monitor
          </span>
        </div>

        <form onSubmit={handleAddWebsite} style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          <input
            className="input-dark"
            style={{ flex: "1 1 300px" }}
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setFormError(""); }}
            required
          />
          <select
            style={{ flex: "0 0 auto", minWidth: 130, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.5rem 0.75rem", color: "var(--text-primary)", fontSize: "0.8125rem", cursor: "pointer" }}
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(Number(e.target.value))}
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
            <option value={1800}>30 minutes</option>
            <option value={3600}>1 hour</option>
          </select>
          <button className="btn-accent" type="submit" disabled={loading} style={{ flexShrink: 0 }}>
            <Plus size={13} />
            {loading ? "Adding..." : "Add Website"}
          </button>
        </form>

        {formError && (
          <div style={{ marginTop: "0.625rem", fontSize: "0.8125rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <AlertTriangle size={13} />
            {formError}
          </div>
        )}
      </div>

      {/* ── Websites Table ─────────────────────────── */}
      <div className="surface" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "0.875rem 1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
              Monitored Websites
            </span>
            <span
              style={{
                marginLeft: "0.625rem",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                padding: "0.1rem 0.4rem",
                borderRadius: 4,
              }}
            >
              {websites.length} total
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.6875rem", color: "#22c55e", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span className="live-dot" /> Live
            </span>
          </div>
        </div>

        <WebsitesTable websites={websites} removeWebsite={removeWebsite} />
      </div>
    </DashboardLayout>
  );
}
