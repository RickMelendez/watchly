import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Bell, Shield, LineChart, Zap, ArrowRight } from "lucide-react";
import { DottedSurface } from "./ui/dotted-surface";
import { Navbar } from "./ui/3d-interactive-navbar";
import DisplayCards from "./ui/display-cards";
import { WordRotate } from "./ui/word-rotate";
import Timeline01 from "./ui/release-time-line";
import { Accordian } from "./ui/accordian";
import { Footer } from "./ui/footer";

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
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[150px] animate-pulse" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse" style={{ animationDuration: '25s', animationDelay: '5s' }} />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(217,70,239,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
              Watchly Advanced Observatory
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]"
            >
              Stop Guessing.
              <br />
              <div className="bg-gradient-to-r flex justify-center lg:justify-start from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent pb-4">
                <WordRotate words={["Monitor Everything.", "Ship Faster.", "Sleep Better.", "Catch Errors."]} className="text-inherit pb-2 h-[1.2em]" />
              </div>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-lg md:text-2xl text-neutral-400 font-medium leading-relaxed"
            >
              The ultimate developer platform for real-time insights, CI/CD pipeline tracking, and instant alerts. Build with confidence.
            </motion.p>

            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-6">
              <button
                onClick={() => navigate("/login")}
                className="group relative inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">Start Monitoring Free <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></span>
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="px-8 py-4 rounded-xl font-bold text-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                View Docs
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-lg hidden lg:flex justify-center items-center"
          >
            <DisplayCards cards={[
              {
                icon: <Activity className="size-4 text-green-300" />,
                title: "Uptime",
                description: "100% Operational",
                date: "Just now",
                iconClassName: "text-green-500",
                titleClassName: "text-green-500",
                className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
              },
              {
                icon: <Zap className="size-4 text-blue-300" />,
                title: "Performance",
                description: "32ms Avg Response",
                date: "2 mins ago",
                iconClassName: "text-blue-500",
                titleClassName: "text-blue-500",
                className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
              },
              {
                icon: <Shield className="size-4 text-purple-300" />,
                title: "Security",
                description: "SSL Certificate Valid",
                date: "Today",
                iconClassName: "text-purple-500",
                titleClassName: "text-purple-500",
                className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
              }
            ]} />
          </motion.div>
        </div>
      </section>

      {/* New TimeLine Component */}
      <Timeline01 />

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/10 relative z-10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">Everything you need to ship fearlessly</h2>
            <p className="text-neutral-400 text-xl max-w-2xl mx-auto font-medium">
              A complete toolkit for monitoring the reliability, performance, and security of your modern infrastructure.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="p-8 rounded-3xl border border-white/10 bg-neutral-950/50 backdrop-blur-md hover:bg-neutral-900/80 hover:border-white/20 transition-all duration-500 group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className={feature.iconColor} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-wide">{feature.title}</h3>
                <p className="text-neutral-400 text-base leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-white/10 relative z-10 bg-black">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">Frequently Asked Questions</h2>
            <p className="text-neutral-400 text-xl font-medium">Everything you need to know about Watchly.</p>
          </div>
          <Accordian items={FAQ_ITEMS} title="" />
        </div>
      </section>


      {/* CTA */}
      <section className="py-32 border-t border-white/10 relative z-10 bg-black">
        <div className="absolute top-[0%] left-[-10%] w-[50%] h-[100%] rounded-[100%] bg-indigo-600/10 blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-neutral-900/40 border border-white/10 p-16 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 pointer-events-none" />
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white relative z-10">Ready to take control?</h2>
            <p className="text-neutral-300 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto relative z-10">
              Join thousands of engineering teams tracking their modern infrastructure with Watchly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="relative z-10 inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.4)] overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white via-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">Deploy Watchly Now <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" /></span>
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
