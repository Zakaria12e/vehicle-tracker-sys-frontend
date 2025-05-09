import React from "react"
import { Link, useLocation , useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MapPin, Car, Clock, Bell, Settings, LogOut, Menu, Home, Shield, Map, BarChart, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
import FloatingNav from "@/components/FloatingNav";
import { motion, AnimatePresence } from "framer-motion";
import {ModeToggle} from "@/components/mode-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user } = useAuth()

const routes = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: Home,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    to: "/dashboard/vehicles",
    label: "Vehicles",
    icon: Car,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    to: "/dashboard/tracking",
    label: "Live Tracking",
    icon: Map,
    color: "text-green-600 dark:text-green-400",
  },
  {
    to: "/dashboard/history",
    label: "Trip History",
    icon: Clock,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    to: "/dashboard/geofencing",
    label: "Geofencing",
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
  },
  {
    to: "/dashboard/immobilization",
    label: "Immobilization",
    icon: Lock,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    to: "/dashboard/alerts",
    label: "Alerts",
    icon: Bell,
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    to: "/dashboard/statistics",
    label: "Statistics",
    icon: BarChart,
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    color: "text-gray-600 dark:text-gray-300",
  },
];



  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <img className="h-5 w-5" src="/architecture-and-city.png" alt="Logo" />
            <span>TrackFleet</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <ModeToggle />
            <Link to="/dashboard/settings">
              <Avatar>
                <AvatarImage
                  src={`http://localhost:5000${user?.photo}`}
                  alt={user?.name}
                  crossOrigin="anonymous"
                />
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
              </Avatar>
            </Link>
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-14 items-center border-b px-4">
                  <div className="flex items-center gap-2 font-bold">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>VehicleTracker</span>
                  </div>
                </div>
                <motion.nav
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {},
                  }}
                  className="grid gap-1 p-2"
                >
                  {routes.map((route, i) => {
                    const Icon = route.icon;
                    const active = location.pathname === route.to;
                    return (
                      <motion.div key={route.to} variants={fadeInUp}>
                        <Link
                          to={route.to}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                            active ? "bg-muted text-foreground" : "text-muted-foreground"
                          )}
                        >
                          <Icon className={cn("h-4 w-4", route.color)} />

                          {route.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <motion.div variants={fadeInUp}>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                </motion.nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/10 md:block">
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
            className="grid gap-1 p-4"
          >
            {routes.map((route) => {
              const Icon = route.icon;
              const active = location.pathname === route.to;
              return (
                <motion.div key={route.to} variants={fadeInUp}>
                  <Link
                    to={route.to}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                      active ? "bg-muted text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", route.color)} />

                    {route.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 md:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Navigation */}
        <FloatingNav />
      </div>
    </div>
  );
}
