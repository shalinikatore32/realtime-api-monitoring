"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dashboardImg from "../../public/landing/dashboard.png";
import heroImg from "../../public/landing/hero.png";
import apiDownImg from "../../public/landing/api_down.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#05070A] text-white overflow-hidden pt-32">
      {/* background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT CONTENT (unchanged) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
            Monitor APIs.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Prevent Downtime
            </span>{" "}
            Before Users Notice.
          </h1>

          <p className="mt-6 text-gray-400 max-w-xl text-lg">
            Real-time API health checks, intelligent alerting, uptime tracking,
            and detailed incident logs — built for modern engineering teams.
          </p>

          <div className="mt-10 flex gap-5">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
              Start Monitoring
            </Button>
            <Button size="lg" variant="outline" className="border-white/20">
              View Live Demo
            </Button>
          </div>
        </motion.div>

        {/* RIGHT VISUAL — IMAGE BASED */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Floating small image - API UP */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -top-10 left-6 z-20"
          >
            <Image
              src={heroImg}
              alt="API operational"
              width={180}
              height={110}
              className="rounded-xl border border-white/10 shadow-xl"
            />
          </motion.div>

          {/* Floating small image - API DOWN */}
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute bottom-12 right-6 z-20"
          >
            <Image
              src={apiDownImg}
              alt="API down alert"
              width={180}
              height={110}
              className="rounded-xl border border-white/10 shadow-xl"
            />
          </motion.div>

          {/* Main dashboard image */}
          <div className="relative z-10 rounded-2xl border border-white/10 bg-black/60 backdrop-blur shadow-2xl overflow-hidden">
            <Image
              src={dashboardImg}
              alt="API Monitoring Dashboard"
              width={720}
              height={420}
              className="rounded-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
