"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useAlerts } from "./AlertProvider";

function timeAgo(timestamp: string) {
  const t = new Date(timestamp).getTime();
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(timestamp).toLocaleString();
}

export default function NotificationBell() {
  const { unread, removeAlert } = useAlerts();
  const unreadCount = unread.length;
  const [open, setOpen] = useState(false);

  // Mark alert as read instantly
  const markAsRead = async (id: string) => {
    const token = Cookies.get("token");
    removeAlert(id);

    await fetch(`http://localhost:8000/api/alerts/read/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        className="relative p-2 hover:scale-105 transition"
        onClick={() => setOpen(!open)}
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
            <div className="p-3 border-b dark:border-neutral-800 font-semibold text-sm">
              Notifications
            </div>

            <div className="max-h-72 overflow-y-auto">
              {unreadCount === 0 && (
                <p className="p-4 text-muted-foreground">No unread alerts 🎉</p>
              )}

              {unread.map((alert: any) => (
                <div
                  key={alert._id}
                  className="p-3 border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer flex gap-3"
                  onClick={() => markAsRead(alert._id)}
                >
                  {alert.severity === "CRITICAL" ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-500 mt-1" />
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-red-600">
                      {alert.name} — {alert.current_state}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {alert.message.split("\n")[0]}
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
