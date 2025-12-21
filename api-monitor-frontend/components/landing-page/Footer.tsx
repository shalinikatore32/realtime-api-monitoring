"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Linkedin, Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#05070A] text-white overflow-hidden">
      {/* top divider glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Activity className="text-indigo-400" />
              API<span className="text-indigo-400">Watch</span>
            </div>

            <p className="mt-4 max-w-md text-gray-400 text-sm leading-relaxed">
              A developer-first API monitoring platform built to detect failures
              early, eliminate alert noise, and provide full visibility into
              system health.
            </p>

            {/* Socials */}
            <div className="mt-6 flex gap-4">
              <Link
                href="https://github.com/shalinikatore32"
                className="text-gray-400 hover:text-white transition"
              >
                <Github size={18} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/shalinikatore"
                className="text-gray-400 hover:text-white transition"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-4">Product</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="#">Features</Link>
              </li>
              <li>
                <Link href="#">Live Status</Link>
              </li>
              <li>
                <Link href="#">Architecture</Link>
              </li>
              <li>
                <Link href="#">Roadmap</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-4">Resources</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="#">Docs</Link>
              </li>
              <li>
                <Link href="#">API Reference</Link>
              </li>
              <li>
                <Link href="#">GitHub</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* bottom line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
        >
          <p>© {new Date().getFullYear()} APIWatch. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
