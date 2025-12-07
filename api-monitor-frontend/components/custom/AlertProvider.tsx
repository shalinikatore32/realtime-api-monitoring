"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

type Alert = any;

type AlertContextType = {
  unread: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlerts = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlerts must be inside AlertProvider");
  return ctx;
};

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unread, setUnread] = useState<Alert[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Add new alert instantly (WS push)
  const addAlert = (alert: Alert) => {
    setUnread((prev) => [alert, ...prev]);
  };

  // Remove alert after marking as read
  const removeAlert = (id: string) => {
    setUnread((prev) => prev.filter((a) => a._id !== id && a.id !== id));
  };

  // Establish WebSocket connection
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const wsUrl = `ws://localhost:8000/ws/alerts?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS Connected");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "alert") {
          const alert = msg.data;

          addAlert(alert);

          // Play alert sound
          if (alert.severity === "CRITICAL") {
            new Audio("/alert.mp3").play().catch(() => {});
          }
        }
      } catch (e) {
        console.warn("WebSocket parse error:", e);
      }
    };

    ws.onclose = () => {
      console.log("WS Disconnected — reconnecting…");
      setTimeout(() => window.location.reload(), 2000);
    };

    return () => ws.close();
  }, []);

  return (
    <AlertContext.Provider value={{ unread, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
