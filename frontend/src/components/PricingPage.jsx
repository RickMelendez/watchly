import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Zap } from "lucide-react";
import api from "../services/api";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    priceLabel: "$9",
    period: "/month",
    description: "Perfect for personal projects and small sites.",
    features: [
      "5 websites monitored",
      "30-second check interval",
      "Email alerts",
      "7-day metric history",
      "Public status page",
    ],
    cta: "Get Started",
    highlighted: false,
    stripePriceId: process.env.REACT_APP_STRIPE_PRICE_STARTER,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    priceLabel: "$29",
    period: "/month",
    description: "For teams that need reliability and deeper insights.",
    features: [
      "50 websites monitored",
      "10-second check interval",
      "Email + SMS alerts",
      "90-day metric history",
      "API access",
      "AI incident analysis",
      "Priority support",
    ],
    cta: "Start 14-day Free Trial",
    highlighted: true,
    stripePriceId: process.env.REACT_APP_STRIPE_PRICE_PRO,
  },
  {
    id: "business",
    name: "Business",
    price: 79,
    priceLabel: "$79",
    period: "/month",
    description: "For organizations that demand zero downtime.",
    features: [
      "Unlimited websites",
      "5-second check interval",
      "All alert channels",
      "1-year metric history",
      "AI root cause analysis",
      "Dedicated support",
      "Custom SLA",
      "SSO & SAML",
    ],
    cta: "Start 14-day Free Trial",
    highlighted: false,
    stripePriceId: process.env.REACT_APP_STRIPE_PRICE_BUSINESS,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    priceLabel: "Custom",
    period: "",
    description: "For large teams with custom security and compliance needs.",
    features: [
      "Everything in Business",
      "Custom check frequency",
      "Dedicated infrastructure",
      "Custom data retention",
      "SLA guarantee",
      "SAML / SSO",
      "Audit logs",
      "Onboarding support",
    ],
    cta: "Contact Sales",
    highlighted: false,
    stripePriceId: null,
    contactSales: true,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (plan) => {
    if (plan.contactSales) {
      window.location.href = "mailto:hello@watchly.io?subject=Enterprise%20Plan%20Inquiry";
      return;
    }

    if (!plan.stripePriceId) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(plan.id);
    setError("");

    try {
      const { data } = await api.post("/billing/create-checkout-session", { price_id: plan.stripePriceId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError("Could not start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <button
          className="btn-ghost"
          onClick={() => navigate(-1)}
          style={{ padding: "0.3rem 0.5rem" }}
        >
          <ArrowLeft size={14} />
        </button>
        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Pricing</span>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.25rem 0.875rem",
              borderRadius: 9999,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#22c55e",
              fontSize: "0.75rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <Zap size={12} />
            Simple Pricing
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
              lineHeight: 1.1,
            }}
          >
            Start free. Scale when ready.
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
            No hidden fees. Cancel anytime. Every plan includes SSL monitoring, API access, and a public status page.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "var(--bg-surface)",
                border: plan.highlighted
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid var(--border)",
                borderRadius: 16,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.highlighted ? "0 0 0 1px rgba(34,197,94,0.1)" : "none",
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#22c55e",
                    color: "#000",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.875rem",
                    borderRadius: "0 0 8px 8px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {plan.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {plan.priceLabel}
                  </span>
                  {plan.period && (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{plan.period}</span>
                  )}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>{plan.description}</p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", flex: 1 }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.8125rem",
                      color: "var(--text-primary)",
                      padding: "0.4rem 0",
                    }}
                  >
                    <Check size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={plan.highlighted ? "btn-accent" : "btn-ghost"}
                style={{ width: "100%", justifyContent: "center", padding: "0.625rem" }}
                disabled={loading === plan.id}
                onClick={() => handleSubscribe(plan)}
              >
                {loading === plan.id ? "Redirecting..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.8125rem",
            marginTop: "2.5rem",
          }}
        >
          All plans include a 14-day free trial for paid features. No credit card required for Starter.
        </p>
      </div>
    </div>
  );
}
