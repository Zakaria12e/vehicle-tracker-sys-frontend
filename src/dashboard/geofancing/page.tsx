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




  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchZones()
  }, [])

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
    setFlyTo(centerCoords); // triggers the motion
    setMapCenter(centerCoords); // sets marker focus if needed
  }
  

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geofencing</h1>
          <p className="text-muted-foreground">Create and manage geographic zones for your vehicles</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
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
                <Button type="button" onClick={handleCreateZone}>Create Zone</Button>
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
            {zones.map((zone) => (
              <div key={zone._id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{zone.name}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                      <DropdownMenuItem>
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
    </div>
  )
}
