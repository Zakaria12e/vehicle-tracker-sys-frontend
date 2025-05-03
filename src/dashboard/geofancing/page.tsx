"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Use a simpler approach for the map component


export default function GeofencingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    radius: "500",
    latitude: "",
    longitude: "",
    vehicles: [],
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleSubmit = () => {
    // Handle form submission
    setIsDialogOpen(false)
    // Reset form
    setFormData({
      name: "",
      description: "",
      radius: "500",
      latitude: "",
      longitude: "",
      vehicles: [],
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geofencing</h1>
          <p className="text-muted-foreground">Create and manage geographic zones for your vehicles</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isEditMode ? "secondary" : "outline"}
            className="gap-1"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Pencil className="h-4 w-4" />
            {isEditMode ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
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
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Office Area"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Main office and surrounding area"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Radius (meters)</Label>
                  <Input
                    id="radius"
                    name="radius"
                    value={formData.radius}
                    onChange={handleChange}
                    type="number"
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center">Center Point</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
                    <Input
                      placeholder="Longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Or click on the map to set the center point</p>
                </div>
                <div className="space-y-2">
                  <Label>Assign Vehicles</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      <SelectItem value="toyota">Toyota Corolla</SelectItem>
                      <SelectItem value="ford">Ford Transit</SelectItem>
                      <SelectItem value="honda">Honda Civic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSubmit}>
                  Create Zone
                </Button>
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
            
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Zone List</CardTitle>
            <CardDescription>Manage your defined zones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Office Area</div>
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
                    <DropdownMenuItem>
                      <CircleDot className="mr-2 h-4 w-4" />
                      Center on map
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Car className="mr-2 h-4 w-4" />
                      Assign vehicles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">500m radius • 3 vehicles assigned</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">Alert when vehicles exit</div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Warehouse Zone</div>
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
                    <DropdownMenuItem>
                      <CircleDot className="mr-2 h-4 w-4" />
                      Center on map
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Car className="mr-2 h-4 w-4" />
                      Assign vehicles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">750m radius • 2 vehicles assigned</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">Alert when vehicles exit</div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">City Center</div>
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
                    <DropdownMenuItem>
                      <CircleDot className="mr-2 h-4 w-4" />
                      Center on map
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Car className="mr-2 h-4 w-4" />
                      Assign vehicles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">1200m radius • 5 vehicles assigned</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">Alert when vehicles exit</div>
                <Switch />
              </div>
            </div>
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
                <tr className="border-b">
                  <td className="whitespace-nowrap px-4 py-3">Ford Transit</td>
                  <td className="whitespace-nowrap px-4 py-3">ABC-789</td>
                  <td className="whitespace-nowrap px-4 py-3">Warehouse Zone, City Center</td>
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
                <tr className="border-b">
                  <td className="whitespace-nowrap px-4 py-3">Honda Civic</td>
                  <td className="whitespace-nowrap px-4 py-3">DEF-456</td>
                  <td className="whitespace-nowrap px-4 py-3">Office Area</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>Outside zone</span>
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
