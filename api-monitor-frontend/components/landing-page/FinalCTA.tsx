"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="relative py-36 bg-[#05070A] text-white overflow-hidden">
      {/* animated gradient waves */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
        />
      </div>

      {/* floating particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff12_1px,transparent_0)] [background-size:24px_24px] opacity-20" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300"
        >
          ⚡ Built for developers who care about uptime
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 text-4xl md:text-5xl xl:text-6xl font-bold leading-tight"
        >
          Stop reacting to outages.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Start preventing them.
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-gray-400 max-w-2xl mx-auto"
        >
          Monitor your APIs in real time, get intelligent alerts, and gain full
          visibility into uptime and performance — all from one powerful
          dashboard.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30"
          >
            Start Monitoring
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5"
          >
            View on GitHub
            <Github className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Confidence line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-sm text-gray-500"
        >
          No credit card required • Developer-first • Built with scalability in
          mind
        </motion.p>
      </div>
    </section>
  );
}
