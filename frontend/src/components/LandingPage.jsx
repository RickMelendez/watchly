import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Bell, Shield, LineChart, Zap, ArrowRight, Server } from "lucide-react";
import { Navbar } from "./ui/3d-interactive-navbar";
import Timeline01 from "./ui/release-time-line";
import { Accordian } from "./ui/accordian";
import { Footer } from "./ui/footer";
import PricingSection from "./ui/pricing-section";
import { DottedSurface } from "./ui/dotted-surface";
import { WordRotate } from "./ui/word-rotate";

const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Track uptime and response time for all your websites, 24/7.",
    iconColor: "text-green-400",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get notified immediately when your sites go down via email or webhook.",
    iconColor: "text-green-400",
  },
  {
    icon: LineChart,
    title: "Performance Analytics",
    description: "Dive deep into historical data and performance trends.",
    iconColor: "text-green-400",
  },
  {
    icon: Shield,
    title: "SSL & Security",
    description: "Monitor SSL certificates and get alerts before they expire.",
    iconColor: "text-green-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Our global network checks your sites every 30 seconds.",
    iconColor: "text-green-400",
  },
  {
    icon: Server,
    title: "CI/CD Pipelines",
    description: "Track deployments, containers, and pipeline status in one place.",
    iconColor: "text-green-400",
  },
];

const FAQ_ITEMS = [
  {
    id: "1",
    icon: Activity,
    title: "What is Watchly?",
    content:
      "Watchly is a real-time monitoring platform that tracks your website uptime, performance metrics, CI/CD pipelines, and sends instant alerts when something goes wrong.",
  },
  {
    id: "2",
    icon: Bell,
    title: "How do I set up alerts?",
    content:
      "After adding a website to your dashboard, navigate to its settings and configure alert thresholds for downtime or slow response times.",
  },
  {
    id: "3",
    icon: Shield,
    title: "Is there an API?",
    content:
      "Yes. Watchly provides a complete REST API so you can integrate monitoring data into your own tools and workflows.",
  },
  {
    id: "4",
    icon: Zap,
    title: "How fast are the checks?",
    content: "Checks run every 30 seconds by default. You can configure the frequency per website from your dashboard.",
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
    <div className="min-h-screen text-white font-sans overflow-x-hidden">
      {/* Animated wave dots background — z-0, canvas fixed to viewport */}
      <DottedSurface />

      {/* All page content sits above the canvas */}
      <div className="relative z-10">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="pt-36 pb-28 px-6 flex flex-col items-center text-center relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2 leading-tight"
          >
            Stop Guessing.
          </motion.div>
          <WordRotate
            words={["Monitor Everything.", "Track Pipelines.", "Catch Incidents.", "Zero Downtime."]}
            duration={2800}
            className="text-5xl md:text-7xl font-black tracking-tight text-green-400 mb-6 leading-tight"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The developer platform for real-time uptime monitoring, CI/CD pipeline tracking, and instant alerts. Build with confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl font-bold text-base transition-colors duration-200"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-green-500/40 text-white/70 hover:text-white px-8 py-4 rounded-xl font-medium text-base transition-colors duration-200"
            >
              Read the Docs
            </button>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <Timeline01 />

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/10 relative z-10 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
              Everything you need to ship fearlessly
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              A complete toolkit for monitoring the reliability, performance, and security of your modern infrastructure.
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
                className="p-7 rounded-2xl border border-green-500/10 bg-black hover:border-green-500/25 hover:bg-green-500/5 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 group-hover:border-green-500/40 transition-colors">
                  <feature.icon className={feature.iconColor} size={22} />
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <div className="border-t border-white/10 relative z-10 bg-black">
        <PricingSection onNavigate={navigate} />
      </div>

      {/* FAQ */}
      <section className="py-24 border-t border-white/10 relative z-10 bg-black">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">Frequently Asked Questions</h2>
            <p className="text-white/50 text-lg">Everything you need to know about Watchly.</p>
          </div>
          <Accordian items={FAQ_ITEMS} title="" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-white/10 relative z-10 bg-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto border border-green-500/20 p-14 rounded-3xl bg-green-500/5"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">Ready to take control?</h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              Join engineering teams tracking their modern infrastructure with Watchly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black px-9 py-4 rounded-xl font-black text-lg transition-colors duration-200"
            >
              Deploy Watchly Now
              <ArrowRight size={22} />
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
      </div>{/* end relative z-10 */}
    </div>
  );
};

export default LandingPage;
