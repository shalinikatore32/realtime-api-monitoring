"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const data = await apiFetch("http://localhost:8000/auth/login", "POST", {
      email,
      password,
    });

    if (data.token) {
      // Save to cookies for middleware
      Cookies.set("token", data.token);

      // Save to local storage for client fetcher
      localStorage.setItem("token", data.token);

      window.location.href = "/dashboard";
    } else {
      alert(data.detail || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-6 bg-white shadow-lg rounded-xl w-96 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </div>
    </div>
  );
}
