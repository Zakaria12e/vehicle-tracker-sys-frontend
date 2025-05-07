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
import { Skeleton } from "@/components/ui/skeleton"
import Mapgeofences from "./Mapgeofences"
import { toast } from "sonner"

export default function GeofencingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [radius, setRadius] = useState(500)
  const [selectedZone, setSelectedZone] = useState<{ center: [number, number]; radius: number } | null>(null)
  const [zones, setZones] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [vehicleList, setVehicleList] = useState<any[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'vehicles'>('map')
  const [loadingZones, setLoadingZones] = useState(true)
  const [vehicleStatuses, setVehicleStatuses] = useState<{ [vehicleId: string]: string }>({});
  const [vehiclePage, setVehiclePage] = useState(1);
  const itemsPerVehiclePage = 3;


  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 2 : 3;
    }
    return 3;
  }
  
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage())
  
  // Update items per page on resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const paginatedZones = zones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(zones.length / itemsPerPage);
 

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchZones()
    fetchVehicles()
  }, [])

  useEffect(() => {
    if (vehicleList.length > 0) {
      vehicleList.forEach((vehicle) => {
        checkVehicleZones(vehicle._id);
      });
    }
  }, [vehicleList]);
  

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_URL}/vehicles`, { credentials: "include" });
      const data = await res.json();
  
      if (res.ok && Array.isArray(data.vehicles)) {
        setVehicleList(data.vehicles);
      } else if (res.ok && Array.isArray(data.data?.vehicles)) {
        setVehicleList(data.data.vehicles);
      } else {
        toast.error("Unexpected response format while loading vehicles");
        setVehicleList([]);
      }
    } catch {
      toast.error("Connection error");
      setVehicleList([]);
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
    } finally {
      setLoadingZones(false)
    }
  }

  const checkVehicleZones = async (vehicleId: string) => {
    try {
      const res = await fetch(`${API_URL}/geofences/check/${vehicleId}`, { credentials: "include" });
      const data = await res.json();
  
      if (res.ok) {
        setVehicleStatuses((prev) => ({
          ...prev,
          [vehicleId]: data.count > 0 ? 'inside' : 'outside',
        }));
      }
    } catch {
      setVehicleStatuses((prev) => ({
        ...prev,
        [vehicleId]: 'unknown',
      }));
    }
  };
  

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
    // On mobile, switch to map tab when centering
    if (window.innerWidth < 768) {
      setActiveTab('map');
    }
  }

  const flattenedAssignments: {
    vehicle: any;
    zoneName: string;
    status: string;
  }[] = [];
  
  vehicleList.forEach((vehicle) => {
    const assignedZones = zones.filter((zone) =>
      (zone.vehicles || []).some(
        (v: any) => v === vehicle._id || (v?._id === vehicle._id)
      )
    );
  
    assignedZones.forEach((zone) => {
      flattenedAssignments.push({
        vehicle,
        zoneName: zone.name,
        status: vehicleStatuses[vehicle._id] || "unknown",
      });
    });
  });
  
  

  const totalVehiclePages = Math.ceil(flattenedAssignments.length / itemsPerVehiclePage);
  const paginatedAssignments = flattenedAssignments.slice(
    (vehiclePage - 1) * itemsPerVehiclePage,
    vehiclePage * itemsPerVehiclePage
  );
  
  
  return (
    <div className="flex flex-col gap-6 p-3 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Geofencing
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Create and manage geographic zones for your vehicles
          </p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedZone(null);
                setRadius(500);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-1 cursor-pointer w-full md:w-auto">
                <Plus className="h-4 w-4" />
                <span>Add Zone</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md md:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Zone</DialogTitle>
                <DialogDescription>
                  Define a geographic area and assign vehicles to it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Zone Name</Label>
                  <Input id="name" name="name" placeholder="Office Area" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Main office and surrounding area"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Radius (meters)</Label>
                  <Input
                    id="radius"
                    name="radius"
                    type="number"
                    placeholder="500"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2 h-[210px]">
                  <Mapgeofences onZoneSelect={setSelectedZone} />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="cursor-pointer w-full md:w-auto"
                  onClick={handleCreateZone}
                >
                  Create Zone
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mobile tab navigation */}
      <div className="flex md:hidden">
        <div className="grid grid-cols-3 w-full border rounded-lg overflow-hidden">
          <button
            className={`py-2 text-center text-sm ${
              activeTab === "map"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
            onClick={() => setActiveTab("map")}
          >
            Map
          </button>
          <button
            className={`py-2 text-center text-sm ${
              activeTab === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Zones
          </button>
          <button
            className={`py-2 text-center text-sm ${
              activeTab === "vehicles"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
            onClick={() => setActiveTab("vehicles")}
          >
            Vehicles
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Map Card - Shown by default on desktop, conditionally on mobile */}
        {(activeTab === "map" || window.innerWidth >= 768) && (
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Zone Map</CardTitle>
              <CardDescription>View and edit geographic zones</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] md:h-[400px] p-2 md:p-6">
              <Mapgeofences zones={zones} center={mapCenter} flyTo={flyTo} />
            </CardContent>
          </Card>
        )}

        {/* Zone List Card - Shown by default on desktop, conditionally on mobile */}
        {(activeTab === "list" || window.innerWidth >= 768) && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Zone List</CardTitle>
              <CardDescription>Manage your defined zones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3 md:p-6">
              {loadingZones ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : zones.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No zones created yet. Add a zone to get started.
                </div>
              ) : (
                paginatedZones.map((zone) => (
                  <div key={zone._id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate max-w-[70%]">
                        {zone.name}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="cursor-pointer h-8 w-8"
                            variant="ghost"
                            size="icon"
                          >
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedZoneId(zone._id);
                              const assigned = (zone.vehicles || []).map(
                                (v: any) => (typeof v === "string" ? v : v._id)
                              );
                              setSelectedVehicles(assigned);
                              fetchVehicles();
                              setAssignDialogOpen(true);
                            }}
                          >
                            <Car className="mr-2 h-4 w-4" />
                            Assign vehicles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteZone(zone._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-muted-foreground">
                      {zone.radius}m radius • {zone.vehicles?.length || 0}{" "}
                      vehicles assigned
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs md:text-sm">
                        Alert when vehicles exit
                      </div>
                      <Switch defaultChecked={zone.notifyOnExit} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            {totalPages > 1 && (
              <div className="mt-2 mb-4 flex justify-center gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2 flex items-center">
                  {currentPage}/{totalPages}
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
        )}
      </div>

      {/* Vehicles Card - Shown by default on desktop, conditionally on mobile */}
      {(activeTab === "vehicles" || window.innerWidth >= 768) && (
        <Card>
          <CardHeader className="py-2 md:py-4">
            <CardTitle>Vehicle Assignments</CardTitle>
            <CardDescription>
              Manage which vehicles are assigned to each zone
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="relative overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-left font-medium">
                      Vehicle
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-left font-medium hidden sm:table-cell">
                      License
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-left font-medium">
                      Zones
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-left font-medium">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-left font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
  {paginatedAssignments.map(({ vehicle, zoneName, status }, index) => (
    <tr key={`${vehicle._id}-${zoneName}-${index}`} className="border-b">
      <td className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">
        {vehicle.name}
      </td>
      <td className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm hidden sm:table-cell">
        {vehicle.licensePlate}
      </td>
      <td className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm ">
        {zoneName}
      </td>
      <td className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">
        <div className="flex items-center gap-1">
          <div
            className={`h-2 w-2 rounded-full ${
              status === "inside"
                ? "bg-green-500"
                : status === "outside"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
          ></div>
          <span className="hidden sm:inline">
            {status === "inside"
              ? "Inside zone"
              : status === "outside"
              ? "Outside zone"
              : "Unknown"}
          </span>
          <span className="sm:hidden">
            {status === "inside"
              ? "In"
              : status === "outside"
              ? "Out"
              : "?"}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-2 md:px-4 md:py-3">
        <Button variant="ghost" size="sm" className="h-7 text-xs md:text-sm md:h-8">
          Edit
        </Button>
      </td>
    </tr>
  ))}
</tbody>


              </table>
              {totalVehiclePages > 1 && (
  <div className="flex justify-center items-center gap-2 my-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setVehiclePage((prev) => prev - 1)}
      disabled={vehiclePage === 1}
    >
      Previous
    </Button>
    <span className="text-sm text-muted-foreground">
      Page {vehiclePage} of {totalVehiclePages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setVehiclePage((prev) => prev + 1)}
      disabled={vehiclePage === totalVehiclePages}
    >
      Next
    </Button>
  </div>
)}

            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Vehicles to Zone</DialogTitle>
            <DialogDescription>
              Select vehicles to assign to this geofence
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-60 overflow-y-auto mt-2">
            {vehicleList.length === 0 ? ( 
              <div className="text-center py-4 text-muted-foreground">
                No vehicles available for assignment
              </div>
            ) : (
              vehicleList.map((vehicle) => (
                <div key={vehicle._id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`veh-${vehicle._id}`}
                    checked={selectedVehicles.includes(vehicle._id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedVehicles((prev) =>
                        checked
                          ? [...prev, vehicle._id]
                          : prev.filter((id) => id !== vehicle._id)
                      );
                    }}
                  />
                  <label
                    htmlFor={`veh-${vehicle._id}`}
                    className="text-sm truncate"
                  >
                    {vehicle.name} – {vehicle.licensePlate}
                  </label>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="w-full md:w-auto"
              onClick={async () => {
                if (!selectedZoneId) return;

                try {
                  const res = await fetch(
                    `${API_URL}/geofences/${selectedZoneId}/vehicles`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ vehicles: selectedVehicles }),
                    }
                  );

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
  );
}