import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Car, MoreHorizontal, CircleDot } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import Mapgeofences from "./Mapgeofences"
import { toast } from "sonner"

export default function GeofencingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [radius, setRadius] = useState(500)
  const [selectedZone, setSelectedZone] = useState<{ center: [number, number]; radius: number } | null>(null)
  const [zones, setZones] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const paginatedZones = zones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(zones.length / itemsPerPage);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
const [assignDialogOpen, setAssignDialogOpen] = useState(false);
const [vehicleList, setVehicleList] = useState<any[]>([]);
const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);




  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchZones()
    fetchVehicles()
    
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_URL}/vehicles`, { credentials: "include" });
      const data = await res.json();
  
      // ✅ Properly handle nested data
      if (res.ok && Array.isArray(data.vehicles)) {
        setVehicleList(data.vehicles);
      } else if (res.ok && Array.isArray(data.data?.vehicles)) {
        setVehicleList(data.data.vehicles);
      } else {
        toast.error("Unexpected response format while loading vehicles");
        setVehicleList([]); // prevent undefined usage
      }
    } catch {
      toast.error("Connection error");
      setVehicleList([]); // prevent undefined usage
    }
  };
  

  const fetchZones = async () => {
    try {
      const res = await fetch(`${API_URL}/geofences`, { credentials: "include" })
      const data = await res.json()
      if (res.ok) {
        setZones(data.data)
      } else {
        toast.error("Failed to load geofences")
      }
    } catch {
      toast.error("Connection error")
    }
  }

  const handleCreateZone = async () => {
    const name = (document.getElementById("name") as HTMLInputElement).value
    const description = (document.getElementById("description") as HTMLInputElement).value

    if (!selectedZone) {
      toast.error("Please select a location on the map")
      return
    }

    try {
      const res = await fetch(`${API_URL}/geofences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          type: "circle",
          radius,
          center: {
            lat: selectedZone.center[0],
            lon: selectedZone.center[1],
          },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setZones((prev) => [...prev, data.data])
        setIsDialogOpen(false)
        toast.success("Zone created")
      } else {
        toast.error(data.message || "Error creating zone")
      }
    } catch {
      toast.error("Failed to create zone")
    }
  }

  const handleDeleteZone = async (id: string) => {
    if (!confirm("Delete this zone?")) return
    try {
      const res = await fetch(`${API_URL}/geofences/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (res.ok) {
        setZones((prev) => prev.filter((z) => z._id !== id))
        toast.success("Zone deleted")
      } else {
        toast.error("Failed to delete zone")
      }
    } catch {
      toast.error("Connection error")
    }
  }

  const centerOnMap = (zone: any) => {
    const centerCoords: [number, number] = [zone.center.lat, zone.center.lon];
    setFlyTo(centerCoords);
    setMapCenter(centerCoords); 
  }
  

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geofencing</h1>
          <p className="text-muted-foreground">Create and manage geographic zones for your vehicles</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedZone(null); 
              setRadius(500);
            }
          }}
          >
            <DialogTrigger asChild>
              <Button className="gap-1 cursor-pointer">
                <Plus className="h-4 w-4" />
                Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Zone</DialogTitle>
                <DialogDescription>Define a geographic area and assign vehicles to it.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Zone Name</Label>
                  <Input id="name" name="name" placeholder="Office Area" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" name="description" placeholder="Main office and surrounding area" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Radius (meters)</Label>
                  <Input id="radius" name="radius" type="number" placeholder="500" onChange={(e) => setRadius(Number(e.target.value))} />
                </div>
                <div className="space-y-2 h-[210px]">
                  <Mapgeofences onZoneSelect={setSelectedZone} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" className="cursor-pointer" onClick={handleCreateZone}>Create Zone</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Zone Map</CardTitle>
            <CardDescription>View and edit geographic zones</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Mapgeofences zones={zones} center={mapCenter} flyTo={flyTo} />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Zone List</CardTitle>
            <CardDescription>Manage your defined zones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {paginatedZones.map((zone) => (
              <div key={zone._id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{zone.name}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="cursor-pointer" variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => centerOnMap(zone)}>
                        <CircleDot className="mr-2 h-4 w-4" />
                        Center on map
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
  setSelectedZoneId(zone._id);
  fetchVehicles();
  setAssignDialogOpen(true);
}}>
  <Car className="mr-2 h-4 w-4" />
  Assign vehicles
</DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteZone(zone._id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {zone.radius}m radius • {zone.vehicles?.length || 0} vehicles assigned
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm">Alert when vehicles exit</div>
                  <Switch defaultChecked={zone.notifyOnExit} />
                </div>
              </div>
            ))}
          </CardContent>
          {totalPages > 1 && (
  <div className="mt-4 flex justify-center gap-2">
    <Button
      variant="outline"
      className="cursor-pointer"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Previous
    </Button>
    <span className="text-sm text-muted-foreground px-2">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="outline"
      className="cursor-pointer"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </Button>
  </div>
)}

        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Assignments</CardTitle>
          <CardDescription>Manage which vehicles are assigned to each zone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">License Plate</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Assigned Zones</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="whitespace-nowrap px-4 py-3">Toyota Corolla</td>
                  <td className="whitespace-nowrap px-4 py-3">XYZ-123</td>
                  <td className="whitespace-nowrap px-4 py-3">Office Area, City Center</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Inside zone</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button variant="ghost" size="sm">
                      Edit Zones
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Assign Vehicles to Zone</DialogTitle>
      <DialogDescription>Select vehicles to assign to this geofence</DialogDescription>
    </DialogHeader>

    <div className="space-y-3 max-h-64 overflow-y-auto">
      {vehicleList.map(vehicle => (
        <div key={vehicle._id} className="flex items-center space-x-3">
          <input
            type="checkbox"
            id={`veh-${vehicle._id}`}
            checked={selectedVehicles.includes(vehicle._id)}
            onChange={() => {
              setSelectedVehicles(prev =>
                prev.includes(vehicle._id)
                  ? prev.filter(id => id !== vehicle._id)
                  : [...prev, vehicle._id]
              );
            }}
          />
          <label htmlFor={`veh-${vehicle._id}`} className="text-sm">
            {vehicle.name} – {vehicle.licensePlate}
          </label>
        </div>
      ))}
    </div>

    <DialogFooter>
      <Button
        onClick={async () => {
          if (!selectedZoneId) return;

          try {
            const res = await fetch(`${API_URL}/geofences/${selectedZoneId}/vehicles`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ vehicles: selectedVehicles }),
            });

            if (res.ok) {
              toast.success("Vehicles assigned");
              setAssignDialogOpen(false);
              fetchZones(); // refresh zones
            } else {
              const data = await res.json();
              toast.error(data.message || "Assignment failed");
            }
          } catch {
            toast.error("Connection error");
          }
        }}
      >
        Save Assignments
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}
