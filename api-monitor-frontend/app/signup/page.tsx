"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const data = await apiFetch("http://localhost:8000/auth/signup", "POST", {
      email,
      password,
    });

    if (data.status === "registered") {
      alert("Account created! Redirecting to login...");
      window.location.href = "/login";
    } else {
      alert(data.detail || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-6 bg-white shadow-md rounded-xl w-96 space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          Create an Account
        </h1>

        <Input
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleSignup} className="w-full">
          Sign Up
        </Button>
      </div>
    </div>
  );
}
