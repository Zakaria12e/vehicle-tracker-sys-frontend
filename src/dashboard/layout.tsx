"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Car,
  Bell,
  Settings,
  LogOut,
  Home,
  Route,
  Target,
  Map,
  BarChart,
  Lock,
  Users,
  ChevronDown,
  HelpCircle 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { ModeToggle } from "@/components/mode-toggle"
import AlertBell from "@/dashboard/alerts/AlertBell"
import FloatingNav from "@/components/FloatingNav"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, logout } = useAuth()

const routes = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: Home,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    to: "/dashboard/vehicles",
    label: "Vehicles",
    icon: Car,
    color: "text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    to: "/dashboard/tracking",
    label: "Live Tracking",
    icon: Map,
    color: "text-lime-600 dark:text-lime-400",
  },
  {
    to: "/dashboard/history",
    label: "Trip History",
    icon: Route,
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    to: "/dashboard/geofencing",
    label: "Geofencing",
    icon: Target,
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    to: "/dashboard/immobilization",
    label: "Immobilization",
    icon: Lock,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    to: "/dashboard/alerts",
    label: "Alerts",
    icon: Bell,
    color: "text-red-600 dark:text-red-400",
  },
  {
    to: "/dashboard/statistics",
    label: "Statistics",
    icon: BarChart,
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    to: "/dashboard/users",
    label: "Users",
    icon: Users,
    color: "text-emerald-600 dark:text-emerald-400",
    visible: user?.role === "admin" || user?.role === "superadmin",
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    color: "text-slate-600 dark:text-slate-300",
  },
  {
  to: "/dashboard/support",
  label: "Support",
  icon: HelpCircle,
  color: "text-blue-600 dark:text-blue-400",
}

];


  const handleLogout = async () => {
    await logout()
  }

  // Generate breadcrumb from current path
  const generateBreadcrumb = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbItems = []

    if (segments.length > 1) {
      breadcrumbItems.push({
        label: "Dashboard",
        href: "/dashboard",
        isLast: false,
      })

      if (segments[1]) {
        const label = segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
        breadcrumbItems.push({
          label: label.replace("-", " "),
          href: pathname,
          isLast: true,
        })
      }
    } else {
      breadcrumbItems.push({
        label: "Dashboard",
        href: "/dashboard",
        isLast: true,
      })
    }

    return breadcrumbItems
  }

  const breadcrumbItems = generateBreadcrumb(location.pathname)

  // Group routes into sections
  const mainRoutes = routes.slice(0, 4)
  const securityRoutes = routes.slice(4, 7)
  const managementRoutes = routes.slice(7)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/dashboard">
                 <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="/car-gps-black.png" alt="Logo Light" className="block dark:hidden" />
                  <img src="/car-gps-white.png" alt="Logo Dark" className="hidden dark:block" />
                 </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">TrackFleet</span>
                    <span className="truncate text-xs">Vehicle Tracking</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainRoutes
                  .filter((route) => route.visible !== false)
                  .map((route) => {
                    const Icon = route.icon
                    const isActive = location.pathname === route.to
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            <Icon className={cn("size-4", route.color)} />
                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Security & Monitoring */}
          <SidebarGroup>
            <SidebarGroupLabel>Security & Monitoring</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {securityRoutes
                  .filter((route) => route.visible !== false)
                  .map((route) => {
                    const Icon = route.icon
                    const isActive = location.pathname === route.to
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            <Icon className={cn("size-4", route.color)} />
                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Management */}
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementRoutes
                  .filter((route) => route.visible !== false)
                  .map((route) => {
                    const Icon = route.icon
                    const isActive = location.pathname === route.to
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            <Icon className={cn("size-4", route.color)} />
                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={`http://localhost:5000${user?.photo}`}
                        alt={user?.name}
                        crossOrigin="anonymous"
                      />
                      <AvatarFallback className="rounded-lg">{user?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
           <Breadcrumb>
  <BreadcrumbList>
    {breadcrumbItems.map((item, index) => (
      <React.Fragment key={item.href}>
        <BreadcrumbItem className="hidden md:block">
          {item.isLast ? (
            <BreadcrumbPage>{item.label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={item.href}>{item.label}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
      </React.Fragment>
    ))}
  </BreadcrumbList>
</Breadcrumb>

          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <AlertBell />
            <ModeToggle />
          </div>
        </motion.header>

        <main className="flex flex-1 flex-col p-0 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <FloatingNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
