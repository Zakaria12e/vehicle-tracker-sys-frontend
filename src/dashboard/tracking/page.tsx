import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Locate, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import VehicleMap from "@/components/VehicleMap";

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/20">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

export default function TrackingPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showGeofences, setShowGeofences] = useState(true);

  const selected = selectedVehicle === "all"
    ? null
    : vehicles.find((v) => v.imei === selectedVehicle);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/vehicles", {
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

          return {
            ...v,
            currentStatus: status,
            lat: telemetry.lat ?? 0,
            lon: telemetry.lon ?? 0,
            telemetry,
          };
        });

        setVehicles(processed);
      } else {
        toast.error("Failed to load vehicles");
      }
    } catch (err) {
      toast.error("Unable to connect to vehicle service");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-xl font-bold">Live Tracking</h1>
          <p className="text-sm text-muted-foreground">Monitor your vehicles in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v._id} value={v.imei}>
                  {v.name} ({v.licensePlate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Locate className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] flex-1 overflow-hidden">
        {/* Map */}
        <div className="relative h-[400px] md:h-full">
          <Suspense fallback={<MapLoading />}>
            <VehicleMap
              devices={vehicles.filter((v) => v.lat !== 0 && v.lon !== 0)}
              selectedVehicle={selectedVehicle}
            />
          </Suspense>
        </div>

        {/* Details Sidebar */}
        <div className="border-l overflow-auto p-4 bg-background">
          <h2 className="text-lg font-medium mb-4">Vehicle Details</h2>

          {selected ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">{selected.licensePlate}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selected.currentStatus === "moving"
                          ? "bg-green-500"
                          : selected.currentStatus === "stopped"
                          ? "bg-yellow-500"
                          : selected.currentStatus === "inactive"
                          ? "bg-gray-400"
                          : "bg-red-500"
                      }`}
                    />
                    <p className="font-medium">{selected.currentStatus}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="font-medium">{selected.telemetry.speed} km/h</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {selected.lat}, {selected.lon}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ignition</p>
                  <p className="font-medium">
                    {selected.telemetry.ignition ? "On" : "Off"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Map Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-traffic">Show Traffic</Label>
                    <Switch
                      id="show-traffic"
                      checked={showTraffic}
                      onCheckedChange={setShowTraffic}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-geofences">Show Geofences</Label>
                    <Switch
                      id="show-geofences"
                      checked={showGeofences}
                      onCheckedChange={setShowGeofences}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="refresh-interval">Refresh Interval</Label>
                      <span className="text-xs text-muted-foreground">{refreshInterval}s</span>
                    </div>
                    <Slider
                      id="refresh-interval"
                      min={1}
                      max={30}
                      step={1}
                      value={[refreshInterval]}
                      onValueChange={(val) => setRefreshInterval(val[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Vehicle Controls</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1 flex-1">
                    <Lock className="h-3 w-3" />
                    Immobilize
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 flex-1">
                    <AlertTriangle className="h-3 w-3" />
                    Alert Driver
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Today's Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span>Distance traveled</span>
                    <span className="font-medium">78 km</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Average speed</span>
                    <span className="font-medium">42 km/h</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Max speed</span>
                    <span className="font-medium">92 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driving time</span>
                    <span className="font-medium">1h 45m</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Select a vehicle to view its details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
