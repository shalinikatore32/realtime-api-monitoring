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

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://localhost:8000/ws/alerts?token=${token}`;

    let retries = 0;
    let reconnectTimeout: number | undefined;

    const connect = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        retries = 0;
        console.log("WS Connected");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "alert") {
            const alert = msg.data;
            addAlert(alert);

            if (alert.severity === "CRITICAL") {
              new Audio("/alert.mp3").play().catch(() => {});
            }
          }
        } catch (e) {
          console.warn("WebSocket parse error:", e);
        }
      };

      ws.onclose = () => {
        console.log("WS Disconnected — reconnecting...");
        const delay = Math.min(30000, 1000 * 2 ** retries);
        retries += 1;
        reconnectTimeout = window.setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <AlertContext.Provider value={{ unread, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
