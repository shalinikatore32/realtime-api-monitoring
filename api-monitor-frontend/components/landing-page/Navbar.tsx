"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all ${
        scrolled
          ? "backdrop-blur-xl bg-black/70 border-b border-white/10 shadow-lg"
          : "backdrop-blur-md bg-black/40"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Activity className="text-indigo-400 group-hover:rotate-12 transition" />
          <span className="text-lg font-semibold text-white">
            API<span className="text-indigo-400">Watch</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10 text-sm text-gray-300">
          {["Features", "Live Status", "How it works", "Architecture"].map(
            (item) => (
              <Link key={item} href="#" className="relative group">
                <span>{item}</span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-400 transition-all group-hover:w-full" />
              </Link>
            )
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Login */}
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Sign in
            </Button>
          </Link>

          {/* Signup */}
          <Link href="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
