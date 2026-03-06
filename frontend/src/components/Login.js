import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, ArrowRight, Shield, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

const TERMINAL_LINES = [
  { delay: 0, text: "$ watchly status --all", color: "#22c55e" },
  { delay: 600, text: "● 3 sites online  ·  99.97% uptime", color: "#a3e635" },
  { delay: 1200, text: "● 0 incidents open  ·  0 failed", color: "#a3e635" },
  { delay: 1800, text: "● Avg response time: 142ms", color: "#a3e635" },
  { delay: 2400, text: "● All security checks passing", color: "#a3e635" },
  { delay: 3000, text: "$ _", color: "#22c55e" },
];

function TerminalPreview() {
  const [visibleLines, setVisibleLines] = useState([]);

  React.useEffect(() => {
    setVisibleLines([]);
    const timeouts = TERMINAL_LINES.map((line) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1f1f1f",
        borderRadius: 10,
        overflow: "hidden",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.8rem",
      }}
    >
      {/* Title bar */}
      <div style={{ padding: "0.6rem 0.875rem", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
        <span style={{ marginLeft: "0.5rem", color: "#4a4a4a", fontSize: "0.7rem" }}>watchly — infrastructure overview</span>
      </div>
      {/* Lines */}
      <div style={{ padding: "1rem" }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ color: line.color, marginBottom: "0.3rem", animation: "fadeIn 0.2s ease" }}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const res = await api.post("/auth/register", { name, email, password });
        if (res.status === 201) {
          const loginRes = await api.post("/auth/login", { email, password });
          localStorage.setItem("token", loginRes.data.access_token);
          if (onLogin) onLogin();
          navigate("/dashboard");
          return;
        }
      } else {
        const res = await api.post("/auth/login", { email, password });
        if (res.data.access_token) {
          localStorage.setItem("token", res.data.access_token);
          if (onLogin) onLogin();
          navigate("/dashboard");
          return;
        }
      }
      setError(isSignUp ? "Signup failed." : "Invalid email or password.");
    } catch (err) {
      setError(isSignUp ? "Signup failed. Try again." : "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Left: Form ───────────────────────────── */}
        <div style={{ padding: "2.5rem" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Terminal size={16} color="#22c55e" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Watchly</span>
          </div>

          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 1.75rem" }}>
            {isSignUp ? "Start monitoring your websites in minutes." : "Sign in to your monitoring dashboard."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {error && (
              <div
                style={{
                  padding: "0.625rem 0.875rem",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 6,
                  fontSize: "0.8125rem",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            {isSignUp && (
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Full Name</label>
                <input className="input-dark" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp} autoComplete="name" />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Email</label>
              <input className="input-dark" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-dark"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  style={{ width: "100%", paddingRight: "2.5rem", boxSizing: "border-box" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    padding: "0 0.75rem",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn-accent" type="submit" disabled={isLoading} style={{ marginTop: "0.25rem", justifyContent: "center", padding: "0.625rem" }}>
              {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              {!isLoading && <ArrowRight size={14} />}
            </button>
          </form>

          <p style={{ marginTop: "1.25rem", fontSize: "0.8125rem", color: "var(--text-muted)", textAlign: "center" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setIsSignUp((p) => !p); setError(""); }}
              style={{ background: "none", border: "none", color: "#22c55e", fontWeight: 500, cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit" }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          <div style={{ marginTop: "1.5rem", padding: "0.75rem", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <Shield size={13} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Your credentials are encrypted and never shared. JWT auth with secure token storage.
            </p>
          </div>
        </div>

        {/* ── Right: Terminal Preview ───────────────── */}
        <div
          style={{
            background: "#0d0d0d",
            borderLeft: "1px solid var(--border)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.25rem",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 0.375rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Infrastructure Monitoring,{" "}
              <span style={{ color: "#22c55e" }}>Reimagined</span>
            </h2>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Monitor uptime, track response times, and get instant alerts when something goes wrong.
            </p>
          </div>

          <TerminalPreview />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
            {[
              ["99.97%", "Avg uptime"],
              ["142ms", "Avg response"],
              ["< 30s", "Check interval"],
              ["24/7", "Monitoring"],
            ].map(([val, label]) => (
              <div key={label} style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 7, padding: "0.625rem" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, fontSize: "1rem", color: "#22c55e" }}>{val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}