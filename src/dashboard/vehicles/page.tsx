import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Plus, Search} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Label } from "@/components/ui/label"
  import { VehicleCard } from "./VehicleCard";

export default function VehiclesPage() {

  const [vehicleData, setVehicleData] = useState({
    name: "",
    model: "",
    plate: "",
    imei: "",
  });
  const [loading, setLoading] = useState(false);
  interface Vehicle {
    _id: string;
    name: string;
    licensePlate: string;
    currentStatus: string;
    lastLocation?: {
      speed: number;
    };
    battery?: number;
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
  
      // Optionally: refresh vehicle list or close modal
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
    try {
      const res = await fetch("http://localhost:5000/api/v1/vehicles", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles(data.data.vehicles);
      } else {
        toast.error("Failed to fetch vehicles");
      }
    } catch (err) {
      toast.error("Could not connect to server");
    }
  };
    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
     <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet</p>
        </div>
        <Dialog>
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
                Enter the vehicle details and IMEI number to add a new vehicle to your fleet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Marke</Label>
                  <Input id="name" 
                   value={vehicleData.name}
                  onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model"  
                  value={vehicleData.model}
                  onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate</Label>
                <Input id="plate"  
                onChange={handleInputChange}
                value={vehicleData.plate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imei">IMEI Number</Label>
                <Input id="imei"  
                onChange={handleInputChange}
                value={vehicleData.imei}
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
          <Input type="search" placeholder="Search vehicles..." className="w-full pl-8" />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="idle">Idle</TabsTrigger>
            <TabsTrigger value="offline">Offline</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {vehicles.map((v) => (
    <VehicleCard
      key={v._id}
      name={v.name}
      licensePlate={v.licensePlate}
      status={v.currentStatus}
      speed={v.lastLocation?.speed || 0}
      battery={v.battery || 100}
    />
  ))}
</div>


        </div>
    )
}