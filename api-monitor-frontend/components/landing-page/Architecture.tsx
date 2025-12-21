"use client";

import { motion } from "framer-motion";
import {
  Server,
  Activity,
  Bell,
  Database,
  ShieldCheck,
  Zap,
} from "lucide-react";

const blocks = [
  {
    title: "Health Check Engine",
    desc: "Distributed workers continuously ping APIs with retries and timeout control.",
    icon: Activity,
    color: "text-emerald-400",
  },
  {
    title: "Event-Driven Alerts",
    desc: "Alerts are triggered only on state changes (UP → DOWN), preventing notification spam.",
    icon: Bell,
    color: "text-red-400",
  },
  {
    title: "Metrics & Logs Store",
    desc: "Latency, uptime, and incidents are persisted for long-term analysis and debugging.",
    icon: Database,
    color: "text-indigo-400",
  },
  {
    title: "Secure API Layer",
    desc: "Authenticated endpoints with rate limiting and role-based access control.",
    icon: ShieldCheck,
    color: "text-sky-400",
  },
  {
    title: "Scalable Backend",
    desc: "Horizontally scalable services designed to handle thousands of monitored endpoints.",
    icon: Server,
    color: "text-purple-400",
  },
  {
    title: "High Availability",
    desc: "Fault-tolerant architecture ensures monitoring continues even during partial failures.",
    icon: Zap,
    color: "text-yellow-400",
  },
];

export default function Architecture() {
  return (
    <section className="relative py-32 bg-[#05070A] text-white overflow-hidden">
      {/* animated mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.15),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-sm font-medium text-indigo-400 mb-3">
            SYSTEM ARCHITECTURE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for reliability,
            <span className="text-indigo-400"> scalability & trust</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Every part of the system is designed to ensure uptime visibility,
            fast incident detection, and noise-free alerting.
          </p>
        </motion.div>

        {/* Architecture grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blocks.map((block, index) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur p-6 shadow-xl"
            >
              {/* glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div
                  className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${block.color}`}
                >
                  <block.icon size={22} />
                </div>

                <h3 className="mt-4 text-lg font-semibold">{block.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {block.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reliability highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 max-w-4xl mx-auto rounded-2xl border border-white/10 bg-black/70 backdrop-blur p-8 text-center shadow-2xl"
        >
          <p className="text-sm text-gray-400">
            Designed with production failures in mind
          </p>
          <h3 className="mt-3 text-2xl font-semibold">
            No alert spam. No blind spots. No guesswork.
          </h3>
          <p className="mt-4 text-gray-400">
            Smart alert suppression, retries, and recovery detection ensure
            you’re notified only when it truly matters.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
