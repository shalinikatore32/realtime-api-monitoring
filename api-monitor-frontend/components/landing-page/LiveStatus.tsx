"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Activity } from "lucide-react";

const services = [
  {
    name: "Auth Service",
    status: "Operational",
    latency: 120,
    healthy: true,
  },
  {
    name: "Payments API",
    status: "Incident",
    latency: null,
    healthy: false,
  },
  {
    name: "Notification Service",
    status: "Operational",
    latency: 98,
    healthy: true,
  },
  {
    name: "User Profile API",
    status: "Operational",
    latency: 140,
    healthy: true,
  },
];

export default function LiveStatus() {
  return (
    <section className="relative py-32 bg-[#05070A] text-white overflow-hidden">
      {/* subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-indigo-400">
            LIVE STATUS
          </span>

          <h2 className="text-3xl md:text-4xl font-bold">
            Real-time visibility into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {" "}
              API health
            </span>
          </h2>

          <p className="mt-4 text-gray-400 text-lg">
            Monitor uptime, latency, and incidents as they happen.
          </p>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 rounded-2xl border border-white/10 bg-black/60 backdrop-blur shadow-2xl overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Activity size={16} className="text-indigo-400" />
              System Status
            </div>
            <span className="text-xs text-gray-400">Updated just now</span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 px-6 py-3 text-xs text-gray-400 border-b border-white/10">
            <span>Service</span>
            <span>Status</span>
            <span className="text-right">Latency</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/10">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 items-center px-6 py-4"
              >
                {/* Service */}
                <span className="font-medium">{service.name}</span>

                {/* Status */}
                <span
                  className={`inline-flex items-center gap-2 text-sm font-medium ${
                    service.healthy ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {service.healthy ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {service.status}
                </span>

                {/* Latency */}
                <div className="text-right">
                  {service.latency ? (
                    <span className="text-sm text-gray-300">
                      {service.latency} ms
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Incident highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 max-w-3xl mx-auto rounded-xl border border-white/10 bg-black/50 backdrop-blur p-6"
        >
          <div className="flex items-start gap-4">
            <span className="mt-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="font-semibold text-red-400">
                Incident detected on Payments API
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Downtime detected · Alert sent · Monitoring recovery
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
