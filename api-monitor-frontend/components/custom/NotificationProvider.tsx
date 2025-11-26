"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, AlertTriangle, Info } from "lucide-react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper: “5 min ago”
function timeAgo(timestamp: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(timestamp).toLocaleString();
}

export default function NotificationBell() {
  const { data } = useSWR("http://localhost:8000/api/alerts", fetcher, {
    refreshInterval: 2000,
  });

  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastAlertId = useRef<string | null>(null);

  // Detect new alerts
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const latest = data[0];

    // Only notify for NEW critical alerts
    if (latest._id !== lastAlertId.current) {
      lastAlertId.current = latest._id;

      if (latest.severity === "CRITICAL") {
        new Audio("/alert.mp3").play().catch(() => {});
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [data]);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        className="relative p-2 hover:scale-105 transition"
        onClick={() => {
          setOpen(!open);
          setUnreadCount(0); // clear unread notifications
        }}
      >
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b dark:border-neutral-800 font-semibold text-sm">
              Notifications
            </div>

            {/* Content */}
            <div className="max-h-72 overflow-y-auto">
              {!Array.isArray(data) && (
                <p className="p-4 text-muted-foreground">Loading...</p>
              )}

              {Array.isArray(data) && data.length === 0 && (
                <p className="p-4 text-muted-foreground">No alerts</p>
              )}

              {Array.isArray(data) &&
                data.slice(0, 8).map((alert: any) => (
                  <div
                    key={alert._id}
                    className="p-3 border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer flex gap-3"
                  >
                    {/* Icon */}
                    {alert.severity === "CRITICAL" ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500 mt-1" />
                    )}

                    {/* Text */}
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          alert.severity === "CRITICAL"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {alert.name} — {alert.current_state}
                      </p>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {alert.message.split("\n")[0]} {/* first line only */}
                      </p>

                      <p className="text-[10px] text-muted-foreground mt-1">
                        {timeAgo(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
