import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, AlertTriangle, Clock, Battery, MapPin, ShieldAlert } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";
import VehicleMap from "@/components/VehicleMap";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 1 },
  }),
};

export default function DashboardPage() {
   const { user } = useAuth()
   const [vehicleStats, setVehicleStats] = useState({
    total: 0,
    lastMonthCount: 0,
    currentMonthCount: 0,
    difference: "+0",
  });
  
  
   const [vehicles, setVehicles] = useState<any[]>([]);

useEffect(() => {
  const fetchVehicles = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/vehicles`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        const processed = data.data.vehicles.map((v: any) => {
          const telemetry = v.telemetry || {};
          let status = v.currentStatus;

          if (status !== "immobilized") {
            if (!telemetry.ignition || telemetry.vehicleBattery === 0) {
              status = "inactive";
            } else if (telemetry.speed === 0) {
              status = "stopped";
            } else {
              status = "moving";
            }
          }

          const lat = telemetry.lat ?? 0;
          const lon = telemetry.lon ?? 0;

          return {
            ...v,
            currentStatus: status,
            lat,
            lon,
            telemetry,
          };
        });

        setVehicles(processed);
      } else {
        console.error("Failed to load vehicles");
      }
    } catch (err) {
      console.error("Unable to connect to vehicle service");
    }
  };


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
  fetchVehicles();
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
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="shadow-sm lg:py-1 lg:h-[150px]">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
            <div className="text-lg font-bold md:text-2xl">{vehicleStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {vehicleStats.difference} from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="shadow-sm lg:py-1 lg:h-[150px]">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
            <div className="text-lg font-bold md:text-2xl">0</div>
            <p className="text-xs text-muted-foreground">0 speed, 0 geofence</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="shadow-sm lg:py-1 lg:h-[150px]">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">Total Distance</CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
            <div className="text-lg font-bold md:text-2xl">0 km</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="shadow-sm lg:py-1 lg:h-[150px]">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 md:p-4 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">Active Vehicles</CardTitle>
            <MapPin className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
            <div className="text-lg font-bold md:text-2xl">0</div>
            <p className="text-xs text-muted-foreground">0 idle, 0 moving</p>
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
            <VehicleMap
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