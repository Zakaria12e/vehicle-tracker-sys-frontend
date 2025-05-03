import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { VehicleCard } from "./VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehiclesPage() {
  const [vehicleData, setVehicleData] = useState({
    name: "",
    model: "",
    plate: "",
    imei: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  interface Vehicle {
    _id: string;
    name: string;
    licensePlate: string;
    currentStatus: "moving" | "stopped" | "inactive" | "immobilized";
    telemetry: {
      vehicleBattery: number;
      ignition: boolean;
      speed: number;
    };
  }

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddVehicle = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: vehicleData.name,
          model: vehicleData.model,
          licensePlate: vehicleData.plate,
          imei: vehicleData.imei,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add vehicle.");
        return;
      }

      toast.success("Vehicle added successfully 🚗");
      setVehicleData({ name: "", model: "", plate: "", imei: "" });
      await fetchVehicles();

      setTimeout(() => {
        setDialogOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/vehicles", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        const updatedVehicles = data.data.vehicles.map((v: any) => {
          let status = v.currentStatus;
          if (status !== "immobilized") {
            if (!v.telemetry?.ignition || v.telemetry?.vehicleBattery === 0) {
              status = "inactive";
            } else if (v.telemetry?.speed === 0) {
              status = "stopped";
            } else {
              status = "moving";
            }
          }

          return {
            _id: v._id,
            name: v.name,
            licensePlate: v.licensePlate,
            currentStatus: status,
            telemetry: {
              vehicleBattery: v.telemetry?.vehicleBattery ?? 0,
              ignition: v.telemetry?.ignition ?? false,
              speed: v.telemetry?.speed ?? 0,
            },
          };
        });

        setVehicles(updatedVehicles);
      } else {
        toast.error("Failed to fetch vehicles");
      }
    } catch (err) {
      toast.error("Could not connect to server");
    } finally {
      setLoadingVehicles(false);
    }
  };

  const filteredVehicles =
    selectedTab === "all"
      ? vehicles
      : vehicles.filter((v) => v.currentStatus === selectedTab);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Enter the vehicle details and IMEI number to add a new vehicle
                to your fleet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Marke</Label>
                  <Input
                    id="name"
                    value={vehicleData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={vehicleData.model}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate</Label>
                <Input
                  id="plate"
                  value={vehicleData.plate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imei">IMEI Number</Label>
                <Input
                  id="imei"
                  value={vehicleData.imei}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddVehicle} disabled={loading}>
                {loading ? "Adding..." : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vehicles..."
            className="w-full pl-8"
          />
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="moving">Moving</TabsTrigger>
            <TabsTrigger value="stopped">Stopped</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="immobilized">Immobilized</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loadingVehicles
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 p-4 border rounded-lg shadow">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full mt-3" />
              </div>
            ))
          : filteredVehicles.map((v) => (
              <VehicleCard
                key={v._id}
                name={v.name}
                licensePlate={v.licensePlate}
                status={v.currentStatus}
                speed={v.telemetry.speed}
                battery={v.telemetry.vehicleBattery}
              />
            ))}
      </div>
    </div>
  );
}
