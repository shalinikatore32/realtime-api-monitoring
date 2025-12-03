"use client";

import { Menu, User } from "lucide-react";
import ModeToggle from "@/components/ui/mode-toggle";
import NotificationBell from "./NotificationProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/logout";

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

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-accent transition">
              <User className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => (window.location.href = "/dashboard/profile")}
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 font-semibold"
              onClick={logout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
