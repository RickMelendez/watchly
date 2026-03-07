import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Bell, Shield, LineChart, Zap, ArrowRight } from "lucide-react";
import { NavbarHero } from "./ui/hero-with-video";
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
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Navbar + Hero */}
      <NavbarHero
        brandName="Watchly"
        heroTitle="Stop Guessing. Monitor Everything."
        heroDescription="The developer platform for real-time uptime monitoring, CI/CD pipeline tracking, and instant alerts. Build with confidence."
      />

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
