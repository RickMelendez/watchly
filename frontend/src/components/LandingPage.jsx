import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Bell, Shield, LineChart, Zap, ArrowRight, Check } from "lucide-react";
import { DottedSurface } from "./ui/dotted-surface";
import { Navbar } from "./ui/3d-interactive-navbar";
import DisplayCards from "./ui/display-cards";
import { WordRotate } from "./ui/word-rotate";
import Timeline01 from "./ui/release-time-line";
import { Accordian } from "./ui/accordian";
import { Footer } from "./ui/footer";
import PricingSection from "./ui/pricing-section";

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
    description: "Get notified immediately when your sites go down via email or SMS.",
    iconColor: "text-yellow-400",
  },
  {
    icon: LineChart,
    title: "Performance Analytics",
    description: "Dive deep into historical data and performance trends.",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "SSL & Security",
    description: "Monitor SSL certificates and get alerts before they expire.",
    iconColor: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Our global network checks your sites every 30 seconds.",
    iconColor: "text-orange-400",
  },
  {
    icon: Activity,
    title: "Status Pages",
    description: "Beautiful public status pages to keep your users informed.",
    iconColor: "text-teal-400",
  },
];


const FAQ_ITEMS = [
  {
    id: "1",
    icon: Activity,
    title: "What is Watchly?",
    content:
      "Watchly is a real-time monitoring platform that tracks your website uptime, performance metrics, and sends instant alerts when something goes wrong.",
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
      "Yes! Watchly provides a complete REST API so you can integrate monitoring data into your own tools and workflows.",
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
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <DottedSurface />
      </div>

      {/* Interactive 3D Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="container relative z-10 mx-auto px-6 pt-40 pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 flex-1"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold tracking-wide"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Now in Public Beta
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05]"
            >
              Stop Guessing.
              <br />
              <span className="text-green-400">
                <WordRotate
                  words={["Monitor Everything.", "Ship Faster.", "Sleep Better.", "Catch Errors."]}
                  className="text-inherit pb-2 h-[1.2em]"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-lg md:text-xl text-neutral-400 font-medium leading-relaxed"
            >
              The developer platform for real-time uptime monitoring, CI/CD pipeline tracking, and instant alerts. Build with confidence.
            </motion.p>

            <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-7 py-3.5 rounded-lg font-bold text-base transition-colors duration-200"
              >
                Start Monitoring Free
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="px-7 py-3.5 rounded-lg font-semibold text-base border border-white/15 text-neutral-300 hover:border-white/30 hover:text-white transition-colors"
              >
                View Docs
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Free forever plan</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-lg hidden lg:flex justify-center items-center"
          >
            <DisplayCards
              cards={[
                {
                  icon: <Activity className="size-4 text-green-300" />,
                  title: "Uptime",
                  description: "100% Operational",
                  date: "Just now",
                  iconClassName: "text-green-500",
                  titleClassName: "text-green-500",
                  className:
                    "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <Zap className="size-4 text-blue-300" />,
                  title: "Performance",
                  description: "32ms Avg Response",
                  date: "2 mins ago",
                  iconClassName: "text-blue-500",
                  titleClassName: "text-blue-500",
                  className:
                    "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <Shield className="size-4 text-purple-300" />,
                  title: "Security",
                  description: "SSL Certificate Valid",
                  date: "Today",
                  iconClassName: "text-purple-500",
                  titleClassName: "text-purple-500",
                  className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
                },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <Timeline01 />

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/10 relative z-10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
              Everything you need to ship fearlessly
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
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
                className="p-7 rounded-2xl border border-white/8 bg-neutral-950/70 hover:border-white/15 hover:bg-neutral-900/70 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-white/8 flex items-center justify-center mb-5 group-hover:border-white/15 transition-colors">
                  <feature.icon className={feature.iconColor} size={22} />
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
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
            <p className="text-neutral-400 text-lg">Everything you need to know about Watchly.</p>
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
            className="max-w-3xl mx-auto bg-neutral-950 border border-white/10 p-14 rounded-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">Ready to take control?</h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of engineering teams tracking their modern infrastructure with Watchly.
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
    </div>
  );
};

export default LandingPage;
