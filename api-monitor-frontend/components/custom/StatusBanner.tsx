"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StatusBanner() {
  const { data } = useSWR("http://localhost:8000/api/status", fetcher, {
    refreshInterval: 5000,
  });

  const healthy = data?.status === "Healthy";

  return (
    <div
      className={cn(
        "w-full rounded-xl px-5 py-3 flex items-center gap-3 font-semibold text-white shadow-md animate-slide-in transition-all",
        healthy
          ? "bg-gradient-to-r from-green-500 to-emerald-600"
          : "bg-gradient-to-r from-red-500 to-rose-600 animate-pulse-soft"
      )}
    >
      {healthy ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <AlertTriangle className="w-5 h-5" />
      )}

      <span className="text-sm sm:text-base">
        {healthy
          ? "All Systems Operational"
          : "Some APIs Are Down — Immediate Attention Needed"}
      </span>
    </div>
  );
}
