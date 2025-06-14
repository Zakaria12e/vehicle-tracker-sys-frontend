import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, AlertTriangle, Clock, Battery, MapPin, ShieldAlert } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";
import VehicleDashboardMap from "@/components/VehicleDashboardMap";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 1 },
  }),
};
const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});
export default function DashboardPage() {
   const { user } = useAuth()
   const [vehicleStats, setVehicleStats] = useState({
    total: 0,
    lastMonthCount: 0,
    currentMonthCount: 0,
    difference: "+0",
    activeVehicles: 0,
    idleVehicles: 0,
    movingVehicles: 0,
  });
  
  
   const [vehicles, setVehicles] = useState<any[]>([]);


useEffect(() => {
  socket.on("vehicle_data", (data) => {
    setVehicles((prev) => {
      const index = prev.findIndex((v) => v.imei === data.imei);
      const updated = {
        ...prev[index],
        lat: data.lat,
        lon: data.lon,
        currentStatus: data.ignition
          ? data.speed > 0
            ? 'moving'
            : 'stopped'
          : 'inactive',
        telemetry: {
          ...prev[index]?.telemetry,
          ...data,
        },
      };

      if (index !== -1) {
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      } else {
        return [...prev, updated];
      }
    });
  });

  return () => {
    socket.off('vehicle_data');
  };

}, []);

useEffect(() => {
  const fetchStats = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await fetch(`${API_URL}/vehicles/stats`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data?.data) {
        setVehicleStats(data.data);
      } else {
        console.error("Failed to fetch vehicle stats");
      }
    } catch (error) {
      console.error("Error fetching vehicle stats:", error);
    }
  };

  fetchStats();
}, []);


return (
  <div className="flex flex-col gap-4 p-3 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
    {/* Header */}
    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.name?.split(" ")[0]}
        </p>
      </div>
    </div>

    {/* Stat Cards */}
<div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
  {/* Total Vehicles */}
  <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
    <Card className="relative overflow-hidden shadow-sm lg:py-1 lg:h-[150px]">
      {/* Bubbles */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600/10 dark:bg-blue-900/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-blue-600/5 dark:bg-blue-900/5 rounded-full" />

      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
        <CardTitle className="text-xs font-medium md:text-sm">Total Vehicles</CardTitle>
        <Car className="h-4 w-4 text-blue-600 dark:text-blue-500" />
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
        <div className="text-lg font-bold md:text-2xl">{vehicleStats.total}</div>
        <p className="text-xs text-muted-foreground">{vehicleStats.difference} from last month</p>
      </CardContent>
    </Card>
  </motion.div>

  {/* Active Alerts */}
  <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
    <Card className="relative overflow-hidden shadow-sm lg:py-1 lg:h-[150px]">
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-600/10 dark:bg-amber-900/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-amber-600/5 dark:bg-amber-900/5 rounded-full" />

      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
        <CardTitle className="text-xs font-medium md:text-sm">Active Alerts</CardTitle>
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
        <div className="text-lg font-bold md:text-2xl">1</div>
        <p className="text-xs text-muted-foreground">1 speed, 0 geofence</p>
      </CardContent>
    </Card>
  </motion.div>

  {/* Total Distance */}
  <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
    <Card className="relative overflow-hidden shadow-sm lg:py-1 lg:h-[150px]">
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-600/10 dark:bg-purple-900/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-purple-600/5 dark:bg-purple-900/5 rounded-full" />

      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
        <CardTitle className="text-xs font-medium md:text-sm">Total Distance</CardTitle>
        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
        <div className="text-lg font-bold md:text-2xl">72 km</div>
        <p className="text-xs text-muted-foreground">This month</p>
      </CardContent>
    </Card>
  </motion.div>

  {/* Active Vehicles */}
  <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
    <Card className="relative overflow-hidden shadow-sm lg:py-1 lg:h-[150px]">
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-600/10 dark:bg-green-900/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-green-600/5 dark:bg-green-900/5 rounded-full" />

      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
        <CardTitle className="text-xs font-medium md:text-sm">Active Vehicles</CardTitle>
        <MapPin className="h-4 w-4 text-green-600 dark:text-green-500" />
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
        <div className="text-lg font-bold md:text-2xl">{vehicleStats.activeVehicles}</div>
        <p className="text-xs text-muted-foreground">{vehicleStats.idleVehicles} idle, {vehicleStats.movingVehicles} moving</p>
      </CardContent>
    </Card>
  </motion.div>
</div>


    {/* Map and Alerts Section */}
    <div className="grid gap-3 md:grid-cols-7">
      <motion.div
        className="md:col-span-7 lg:col-span-4"
        custom={0}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-sm">
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-lg md:text-xl">Vehicle Locations</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Current position of all your vehicles
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] p-0 overflow-hidden rounded-md sm:h-[300px] md:h-[320px] lg:h-[360px]">
            <VehicleDashboardMap
              devices={vehicles.filter((v) => v.lat !== 0 && v.lon !== 0)}
              selectedVehicle="all"
              triggerZoom={false}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="md:col-span-7 lg:col-span-3"
        custom={1}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-sm">
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-lg md:text-xl">Recent Alerts</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Latest notifications from your vehicles
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="space-y-3">
              <AlertItem
                icon={<ShieldAlert className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
                title="Geofence Exit Alert"
                description="Vehicle XYZ-123 left designated zone"
                time="Today, 10:42 AM"
                bg="bg-red-100 dark:bg-red-900/50"
              />
              <AlertItem
                icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />}
                title="Speed Alert"
                description="Vehicle ABC-789 exceeded speed limit (92 km/h)"
                time="Today, 9:15 AM"
                bg="bg-amber-100 dark:bg-amber-900/50"
              />
              <AlertItem
                icon={<Battery className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                title="Low Battery"
                description="Vehicle DEF-456 tracker battery at 15%"
                time="Yesterday, 6:30 PM"
                bg="bg-blue-100 dark:bg-blue-900/50"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
);
}

// Alert item reusable component
function AlertItem({
icon,
title,
description,
time,
bg,
}: {
icon: React.ReactNode;
title: string;
description: string;
time: string;
bg: string;
}) {
return (
  <div className="flex items-start gap-3">
    <div className={`rounded-full p-1.5 ${bg} flex-shrink-0`}>
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-xs font-medium sm:text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
);
}