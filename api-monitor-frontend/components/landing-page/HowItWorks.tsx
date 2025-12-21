"use client";

import { motion } from "framer-motion";
import { Link2, Activity, BellRing, BarChart } from "lucide-react";

const steps = [
  {
    title: "Add Your API",
    description:
      "Register your API endpoint with method, headers, and expected response in seconds.",
    icon: Link2,
    color: "from-indigo-400 to-purple-400",
  },
  {
    title: "Continuous Monitoring",
    description:
      "Automated health checks run at defined intervals to track uptime, latency, and failures.",
    icon: Activity,
    color: "from-emerald-400 to-teal-400",
  },
  {
    title: "Smart Alerts",
    description:
      "Alerts are triggered only when API state changes, avoiding notification spam.",
    icon: BellRing,
    color: "from-red-400 to-pink-400",
  },
  {
    title: "Analyze & Improve",
    description:
      "Review uptime history, incidents, and performance trends to prevent future outages.",
    icon: BarChart,
    color: "from-purple-400 to-indigo-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32 bg-[#05070A] text-white overflow-hidden">
      {/* background gradient */}
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
            HOW IT WORKS
          </span>

          <h2 className="text-3xl md:text-4xl font-bold">
            A simple flow from setup to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {" "}
              instant alerts
            </span>
          </h2>

          <p className="mt-4 text-gray-400 text-lg">
            Designed as a clear, reliable monitoring workflow.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-28">
          {/* center vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/10 -translate-x-1/2 hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={step.title}
                  initial={{
                    opacity: 0,
                    x: isLeft ? -60 : 60,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative grid grid-cols-1 md:grid-cols-2 items-center"
                >
                  {/* LEFT CARD */}
                  {isLeft && (
                    <div className="md:pr-16">
                      <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur p-6 shadow-xl">
                        <h3 className="text-lg font-semibold">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="mt-2 text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CENTER ICON */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <step.icon size={22} className="text-black" />
                    </div>
                  </div>

                  {/* RIGHT CARD */}
                  {!isLeft && (
                    <div className="md:pl-16 md:col-start-2">
                      <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur p-6 shadow-xl">
                        <h3 className="text-lg font-semibold">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="mt-2 text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
