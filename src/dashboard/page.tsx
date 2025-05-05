import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, AlertTriangle, Clock, Battery, MapPin, ShieldAlert } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";
import VehicleMap from "@/components/VehicleMap";

export default function DashboardPage() {
   const { user } = useAuth()

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

  fetchVehicles();
}, []);


  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name?.split(" ")[0]}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Vehicles
            </CardTitle>
            <Car className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 speed alerts, 0 geofence
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Distance
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 km</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Active Vehicles
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 idle, 0 in motion</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl">Vehicle Locations</CardTitle>
            <CardDescription>
              Current position of all your vehicles
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[360px] overflow-hidden rounded-md">
            <VehicleMap
              devices={vehicles.filter((v) => v.lat !== 0 && v.lon !== 0)}
              selectedVehicle="all"
              triggerZoom={false}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Recent Alerts</CardTitle>
            <CardDescription>
              Latest notifications from your vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/50">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Geofence Exit Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Vehicle XYZ-123 left designated zone
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Today, 10:42 AM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/50">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Speed Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Vehicle ABC-789 exceeded speed limit (92 km/h)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Today, 9:15 AM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/50">
                  <Battery className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Low Battery</p>
                  <p className="text-xs text-muted-foreground">
                    Vehicle DEF-456 tracker battery at 15%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Yesterday, 6:30 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
