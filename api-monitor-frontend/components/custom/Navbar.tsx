"use client";

import { Menu, User } from "lucide-react";
import ModeToggle from "@/components/ui/mode-toggle";
import NotificationBell from "./NotificationProvider";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 h-16 border-b bg-background">
      {/* Mobile Menu Button */}
      <button className="lg:hidden p-2" onClick={onMenuClick}>
        <Menu className="w-6 h-6" />
      </button>

      {/* Title + Live status */}
      <div className="flex items-center gap-3 overflow-hidden">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">
          API Monitoring Dashboard
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationBell />

        {/* Light/Dark */}
        <ModeToggle />

        {/* User */}
        <User className="w-6 h-6 cursor-pointer" />
      </div>
    </header>
  );
}
