// app/vehicles/VehiclesPage.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Plus, Search, Power, AlertTriangle } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { VehicleCard } from "./VehicleCard"

interface Vehicle {
  _id: string
  name: string
  model: string
  licensePlate: string
  currentStatus: "moving" | "stopped" | "inactive" | "immobilized"
  telemetry: {
    vehicleBattery: number
    ignition: boolean
    speed: number
    timestamp: string
  }
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleData, setVehicleData] = useState({ name: "", model: "", plate: "", imei: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchVehicles = async () => {
    setLoadingVehicles(true)
    try {
      const res = await fetch("http://localhost:5000/api/v1/vehicles", { credentials: "include" })
      const data = await res.json()
      if (res.ok) {
        const updated = data.data.vehicles.map((v: any) => {
          let status = v.currentStatus
          if (status !== "immobilized") {
            if (!v.telemetry?.ignition || v.telemetry?.vehicleBattery === 0) {
              status = "inactive"
            } else if (v.telemetry?.speed === 0) {
              status = "stopped"
            } else {
              status = "moving"
            }
          }

          return {
            _id: v._id,
            name: v.name,
            model: v.model,
            licensePlate: v.licensePlate,
            currentStatus: status,
            telemetry: {
              vehicleBattery: v.telemetry?.vehicleBattery ?? 0,
              ignition: v.telemetry?.ignition ?? false,
              speed: v.telemetry?.speed ?? 0,
              timestamp: v.telemetry?.timestamp ?? null,
            },
          }
        })
        setVehicles(updated)
      } else {
        toast.error("Failed to fetch vehicles")
      }
    } catch {
      toast.error("Could not connect to server")
    } finally {
      setLoadingVehicles(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setVehicleData((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddVehicle = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/v1/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: vehicleData.name,
          model: vehicleData.model,
          licensePlate: vehicleData.plate,
          imei: vehicleData.imei,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to add vehicle.")
        return
      }

      toast.success("Vehicle added successfully")
      setVehicleData({ name: "", model: "", plate: "", imei: "" })
      await fetchVehicles()
      setTimeout(() => setDialogOpen(false), 1000)
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const filtered = vehicles.filter((v) => {
    if (selectedTab !== "all" && v.currentStatus !== selectedTab) return false
    const search = searchQuery.toLowerCase()
    return v.name.toLowerCase().includes(search) || v.model.toLowerCase().includes(search)
  })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1"><Plus className="h-4 w-4" /> Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>Enter the vehicle details and IMEI number.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2"><Label htmlFor="name">Make</Label><Input id="name" value={vehicleData.name} onChange={handleInputChange} /></div>
                <div className="flex flex-col space-y-2"><Label htmlFor="model">Model</Label><Input id="model" value={vehicleData.model} onChange={handleInputChange} /></div>
              </div>
              <div className="flex flex-col space-y-2"><Label htmlFor="plate">License Plate</Label><Input id="plate" value={vehicleData.plate} onChange={handleInputChange} /></div>
              <div className="flex flex-col space-y-2"><Label htmlFor="imei">IMEI Number</Label><Input id="imei" value={vehicleData.imei} onChange={handleInputChange} /></div>
            </div>
            <DialogFooter><Button onClick={handleAddVehicle} disabled={loading}>{loading ? "Adding..." : "Add Vehicle"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search by name or model..." className="w-full pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="moving">Moving</TabsTrigger>
            <TabsTrigger value="stopped">Stopped</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="immobilized">Immobilized</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Vehicle Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        {loadingVehicles
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 p-4 border rounded-lg shadow">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full mt-3" />
              </div>
            ))
          : filtered.map((v) => (
              <div key={v._id} onClick={() => setSelectedVehicle(v)} className="cursor-pointer">
                <VehicleCard
                  name={v.name}
                  licensePlate={v.licensePlate}
                  status={v.currentStatus}
                  speed={v.telemetry.speed}
                  battery={v.telemetry.vehicleBattery}
                  timestamp={v.telemetry.timestamp}
                />
              </div>
            ))}
      </div>

      {/* Details Panel */}
      {selectedVehicle && (
        <div className="mt-6 border rounded-lg p-4 sm:p-6 bg-background shadow w-full">

          <h2 className="text-lg font-semibold">{selectedVehicle.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedVehicle.licensePlate}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Status</p><p>{selectedVehicle.currentStatus}</p></div>
            <div><p className="text-xs text-muted-foreground">Speed</p><p>{selectedVehicle.telemetry.speed} km/h</p></div>
            <div><p className="text-xs text-muted-foreground">Battery</p><p>{selectedVehicle.telemetry.vehicleBattery}%</p></div>
            <div><p className="text-xs text-muted-foreground">Ignition</p><p>{selectedVehicle.telemetry.ignition ? "On" : "Off"}</p></div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline"><Power className="h-4 w-4" /> Immobilize</Button>
            <Button variant="outline"><AlertTriangle className="h-4 w-4" /> Alert Driver</Button>
          </div>
        </div>
      )}
    </div>
  )
}
