"use client";

import {
  BarChart2,
  Activity,
  AlertCircle,
  Logs,
  X,
  CirclePlus,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isExpanded = hovered || !collapsed;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
    { href: "/dashboard/activity", label: "API Activity", icon: Activity },
    { href: "/dashboard/logs", label: "Logs", icon: Logs },
    { href: "/dashboard/alerts", label: "Alerts", icon: AlertCircle },
    { href: "/dashboard/manage-apis", label: "Manage APIs", icon: CirclePlus },
  ];

  const linkClasses = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
     ${
       pathname === path
         ? "bg-primary/10 text-primary font-semibold"
         : "hover:bg-accent hover:text-foreground"
     }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-full bg-muted/70 border-r
          backdrop-blur-md shadow-xl transition-all duration-300 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: isExpanded ? 240 : 72,
        }}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* MOBILE CLOSE BUTTON */}
        <button
          className="lg:hidden absolute top-4 right-4 p-1 bg-background/70 rounded-full shadow-sm"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="border-b p-5 flex items-center justify-between">
          {isExpanded && (
            <h1 className="text-lg font-bold tracking-tight">API Monitor</h1>
          )}

          {/* COLLAPSE BUTTON */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-accent transition"
          >
            {collapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>
        </div>

        {/* LINKS */}
        <nav className="mt-4 px-3 flex-1 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkClasses(item.href)} ${
                  !isExpanded ? "justify-center" : ""
                }`}
                onClick={onClose}
              >
                <Icon size={18} />

                {/* HIDE LABEL WHEN COLLAPSED */}
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}

        {isExpanded && (
          <div className="p-4 border-t flex flex-col gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("email");
                window.location.href = "/login";
              }}
              className="w-full py-2 px-3 text-sm rounded-lg bg-destructive text-white hover:bg-destructive/90 transition"
            >
              Logout
            </button>

            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} API Monitor
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
