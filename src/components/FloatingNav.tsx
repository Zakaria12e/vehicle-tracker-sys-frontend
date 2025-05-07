import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Car,
  Map,
  Clock,
  Shield,
  Lock,
  Bell,
  BarChart,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FloatingNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const routes = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/dashboard/vehicles", label: "Vehicles", icon: Car },
    { to: "/dashboard/tracking", label: "Tracking", icon: Map },
    { to: "/dashboard/history", label: "History", icon: Clock },
    { to: "/dashboard/geofencing", label: "Geofencing", icon: Shield },
    { to: "/dashboard/immobilization", label: "Immobilize", icon: Lock },
    { to: "/dashboard/alerts", label: "Alerts", icon: Bell },
    { to: "/dashboard/statistics", label: "Stats", icon: BarChart },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={navRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 md:hidden"
    >
      {/* Grid Menu */}
      {open && (
        <div
          className={cn(
            "grid grid-cols-3 gap-4 p-4 rounded-xl shadow-xl",
            "bg-white dark:bg-card border dark:border",
            "transition-all duration-300 animate-in fade-in zoom-in"
          )}
        >
          {routes.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center justify-center gap-1 text-xs text-center group hover:text-primary transition"
            >
              <div className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
          "transition-transform duration-300 ease-in-out",
          open && "rotate-45"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
}
