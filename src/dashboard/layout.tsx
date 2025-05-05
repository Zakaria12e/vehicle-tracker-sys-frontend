import React from "react"
import { Link, useLocation , useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MapPin, Car, Clock, Bell, Settings, LogOut, Menu, Home, Shield, Map, BarChart, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user } = useAuth()

  const routes = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: location.pathname === "/dashboard",
    },
    {
      to: "/dashboard/vehicles",
      label: "Vehicles",
      icon: Car,
      active: location.pathname === "/dashboard/vehicles",
    },
    {
      to: "/dashboard/tracking",
      label: "Live Tracking",
      icon: Map,
      active: location.pathname === "/dashboard/tracking",
    },
    {
      to: "/dashboard/history",
      label: "Trip History",
      icon: Clock,
      active: location.pathname === "/dashboard/history",
    },
    {
      to: "/dashboard/geofencing",
      label: "Geofencing",
      icon: Shield,
      active: location.pathname === "/dashboard/geofencing",
    },
    {
      to: "/dashboard/immobilization",
      label: "Immobilization",
      icon: Lock,
      active: location.pathname === "/dashboard/immobilization",
    },
    {
      to: "/dashboard/alerts",
      label: "Alerts",
      icon: Bell,
      active: location.pathname === "/dashboard/alerts",
    },
    {
      to: "/dashboard/statistics",
      label: "Statistics",
      icon: BarChart,
      active: location.pathname === "/dashboard/statistics",
    },
    {
      to: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: location.pathname === "/dashboard/settings",
    },
  ]

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <img className="h-5 w-5" src="/architecture-and-city.png" alt="Vehicle Tracker Logo" />
            <span>TrackFleet</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
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
                <nav className="grid gap-1 p-2">
                  {routes.map((route) => (
                    <Link
                      key={route.to}
                      to={route.to}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                        route.active ? "bg-muted text-foreground" : "text-muted-foreground",
                      )}>
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  ))}
                  <Link
                    to="#"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                  >   
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/10 md:block">
          <nav className="grid gap-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.to}
                to={route.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  route.active ? "bg-muted text-foreground" : "text-muted-foreground",
                )}>
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
            
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
