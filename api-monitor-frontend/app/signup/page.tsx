"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { Activity, Chrome } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    setLoading(true);
    setError("");

    const data = await apiFetch("http://localhost:8000/auth/signup", "POST", {
      email,
      password,
    });

    setLoading(false);

    if (data?.status === "registered") {
      window.location.href = "/login";
    } else {
      setError(data?.detail || "Signup failed");
    }
  }

  // Google OAuth signup
  function handleGoogleSignup() {
    window.location.href = "http://localhost:8000/auth/google/login";
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#05070A] text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-black/60 backdrop-blur border border-white/10 shadow-2xl"
      >
        {/* App Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Activity className="text-indigo-400" size={28} />
            <span>
              API<span className="text-indigo-400">Watch</span>
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-center text-gray-400">
          Start monitoring your APIs in minutes
        </p>

        {/* Google Signup */}
        <div className="mt-6">
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 border-white/15 bg-white/5 hover:bg-white/10"
          >
            <Chrome size={18} />
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email Signup */}
        <div className="space-y-4">
          <Input
            placeholder="Email address"
            type="email"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
