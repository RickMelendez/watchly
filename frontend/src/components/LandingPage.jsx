import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Bell, Shield, LineChart, Zap, ArrowRight, Check } from "lucide-react";
import { DottedSurface } from "./ui/dotted-surface";
import NavBar from "./ui/navbar";
import { Accordian } from "./ui/accordian";
import { Footer } from "./ui/footer";

const NAV_ITEMS = [
  { id: 1, title: "Features", url: "#features" },
  { id: 2, title: "Docs", url: "/docs" },
  { id: 3, title: "Pricing", url: "#pricing" },
];

const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Track uptime and response time for all your websites, 24/7.",
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get notified immediately when your sites go down via email or SMS.",
    color: "from-yellow-500/20 to-orange-500/10",
    iconColor: "text-yellow-400",
  },
  {
    icon: LineChart,
    title: "Performance Analytics",
    description: "Dive deep into historical data and performance trends.",
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "SSL & Security",
    description: "Monitor SSL certificates and get alerts before they expire.",
    color: "from-purple-500/20 to-violet-500/10",
    iconColor: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Our global network checks your sites every 30 seconds.",
    color: "from-red-500/20 to-pink-500/10",
    iconColor: "text-red-400",
  },
  {
    icon: Activity,
    title: "Status Pages",
    description: "Beautiful public status pages to keep your users informed.",
    color: "from-teal-500/20 to-cyan-500/10",
    iconColor: "text-teal-400",
  },
];

const FAQ_ITEMS = [
  {
    id: "1",
    icon: Activity,
    title: "What is Watchly?",
    content: "Watchly is a real-time monitoring platform that tracks your website uptime, performance metrics, and sends instant alerts when something goes wrong.",
  },
  {
    id: "2",
    icon: Bell,
    title: "How do I set up alerts?",
    content: "After adding a website to your dashboard, navigate to its settings and configure alert thresholds for downtime or slow response times.",
  },
  {
    id: "3",
    icon: Shield,
    title: "Is there an API?",
    content: "Yes! Watchly provides a complete REST API so you can integrate monitoring data into your own tools and workflows.",
  },
  {
    id: "4",
    icon: Zap,
    title: "How fast are the checks?",
    content: "Checks run as frequently as every 10 seconds. You choose the frequency per website from your dashboard.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DottedSurface />

      {/* Sticky Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <span
            className="text-xl font-bold text-foreground cursor-pointer"
            onClick={() => navigate("/")}
          >
            Watchly
          </span>
          <NavBar list={NAV_ITEMS} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-40 pb-28 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Intelligent System Monitoring
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Monitor Your Systems
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              With Precision
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg md:text-xl text-muted-foreground"
          >
            Get real-time insights and instant alerts. Keep your systems running smoothly with Watchly's advanced monitoring solution.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/30"
            >
              Start Monitoring Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="px-6 py-3 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              View Docs
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to stay in control</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete toolkit for monitoring the reliability and performance of your infrastructure.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`p-6 rounded-2xl border border-border/60 bg-gradient-to-br ${feature.color} backdrop-blur-sm hover:border-border transition-all duration-300 group`}
              >
                <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-4 border border-border/60">
                  <feature.icon className={feature.iconColor} size={22} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about Watchly.</p>
          </div>
          <Accordian items={FAQ_ITEMS} title="" />
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for personal projects",
                features: ["5 websites", "5-min check interval", "Email alerts", "7-day history"],
                cta: "Get Started",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/ month",
                description: "For growing teams",
                features: ["50 websites", "30-sec check interval", "Email + SMS alerts", "90-day history", "API access", "Status pages"],
                cta: "Start Free Trial",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations",
                features: ["Unlimited websites", "10-sec check interval", "All alert channels", "Unlimited history", "SLA guarantee", "Dedicated support"],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={`relative p-8 rounded-2xl border flex flex-col gap-6 transition-all duration-300 ${plan.highlight
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-105"
                    : "border-border/60 bg-card hover:border-border"
                  }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={15} className="text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/login")}
                  className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-muted"
                    }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to take control?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of teams monitoring their systems with Watchly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
            >
              Get Started Now <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer
        onSubscribe={async (email) => {
          console.log("Newsletter signup:", email);
          return true;
        }}
      />
    </div>
  );
};

export default LandingPage;
