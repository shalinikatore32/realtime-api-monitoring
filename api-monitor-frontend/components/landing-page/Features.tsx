"use client";

import { motion } from "framer-motion";
import { Activity, Bell, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Real-Time API Monitoring",
    description:
      "Continuously monitor your APIs with configurable health checks and response validation.",
    icon: Activity,
    color: "text-emerald-400",
  },
  {
    title: "Intelligent Alerting",
    description:
      "Avoid alert spam with smart suppression when APIs remain down and instant recovery notifications.",
    icon: Bell,
    color: "text-indigo-400",
  },
  {
    title: "Uptime & Performance Metrics",
    description:
      "Track uptime percentage, latency, response time, and failure rates with visual insights.",
    icon: BarChart3,
    color: "text-purple-400",
  },
  {
    title: "Secure & Scalable Design",
    description:
      "Built with secure authentication, rate limiting, and architecture designed to scale effortlessly.",
    icon: ShieldCheck,
    color: "text-sky-400",
  },
];

export default function Features() {
  return (
    <section className="relative py-28 bg-[#05070A] text-white overflow-hidden">
      {/* subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff0d_1px,transparent_0)] [background-size:32px_32px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-sm font-medium text-indigo-400 mb-3">
            POWERFUL FEATURES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need to
            <span className="text-indigo-400"> monitor APIs reliably</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Designed for developers who care about uptime, performance, and fast
            incident response.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur p-6 shadow-lg"
            >
              {/* glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex gap-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${feature.color}`}
                >
                  <feature.icon size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
