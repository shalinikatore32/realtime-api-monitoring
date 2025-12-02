"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { API_BASE } from "@/lib/api";

const fetcher = async (url: string) => {
  const token = Cookies.get("token");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.warn("Failed to fetch system status:", res.status);
    return null;
  }

  return res.json();
};

export default function StatusBanner() {
  const { data } = useSWR(`${API_BASE}/status`, fetcher, {
    refreshInterval: 5000,
  });

  // New backend returns an array of statuses → determine health:
  // Healthy = all APIs UP or SLOW, none DOWN
  const isHealthy =
    Array.isArray(data) && data.length > 0
      ? data.every((api) => api.state !== "DOWN")
      : true;

  return (
    <div
      className={cn(
        "w-full rounded-xl px-5 py-3 flex items-center gap-3 font-semibold text-white shadow-md animate-slide-in transition-all",
        isHealthy
          ? "bg-gradient-to-r from-green-500 to-emerald-600"
          : "bg-gradient-to-r from-red-500 to-rose-600 animate-pulse-soft"
      )}
    >
      {isHealthy ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <AlertTriangle className="w-5 h-5" />
      )}

      <span className="text-sm sm:text-base">
        {isHealthy
          ? "All Systems Operational"
          : "Some APIs Are Down — Immediate Attention Needed"}
      </span>
    </div>
  );
}
