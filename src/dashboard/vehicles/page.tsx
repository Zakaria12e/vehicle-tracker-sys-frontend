// app/vehicles/VehiclesPage.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Plus, Search, Loader2 } from "lucide-react"
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
import { motion, AnimatePresence } from "framer-motion"
const API_URL = import.meta.env.VITE_API_URL;

interface Vehicle {
  _id: string
  name: string
  model: string
  imei: string
  licensePlate: string
  currentStatus: "moving" | "stopped" | "inactive" | "immobilized"
  telemetry: {
    vehicleBattery: number
    ignition: boolean
    speed: number
    timestamp: string
  }
}

// Animation variants with shorter, more consistent timing
const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

// Container stagger animation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)


  const fetchVehicles = async () => {
    setLoadingVehicles(true)
    try {
      const res = await fetch(`${API_URL}/vehicles`, { credentials: "include" })
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
            imei: v.imei,
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
      const res = await fetch(`${API_URL}/vehicles`, {
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
    const updateItemsPerPage = () => {
      const isMobile = window.innerWidth < 640 // Tailwind's `sm`
      setItemsPerPage(isMobile ? 3 : 6)
    }
  
    updateItemsPerPage() // Set on load
    window.addEventListener("resize", updateItemsPerPage)
    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1)
  }, [searchQuery, selectedTab])

  const filtered = vehicles.filter((v) => {
    if (selectedTab !== "all" && v.currentStatus !== selectedTab) return false
    const search = searchQuery.toLowerCase()
    return v.name.toLowerCase().includes(search) || v.model.toLowerCase().includes(search)
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedVehicles = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <motion.div 
      className="flex flex-col gap-4 p-3 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Vehicles</h1>
          <p className="text-sm text-muted-foreground">Manage your vehicle fleet</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1 cursor-pointer mt-2 md:mt-0 h-9">
              <Plus className="h-4 w-4" /> 
              <span>Add Vehicle</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription className="text-sm">
                Enter the vehicle details and IMEI number.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className="text-sm">Make</Label>
                  <Input id="name" value={vehicleData.name} onChange={handleInputChange} className="h-9" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="model" className="text-sm">Model</Label>
                  <Input id="model" value={vehicleData.model} onChange={handleInputChange} className="h-9" />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="plate" className="text-sm">License Plate</Label>
                <Input id="plate" value={vehicleData.plate} onChange={handleInputChange} className="h-9" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="imei" className="text-sm">IMEI Number</Label>
                <Input id="imei" value={vehicleData.imei} onChange={handleInputChange} className="h-9" />
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="cursor-pointer w-full sm:w-auto h-9" 
                onClick={handleAddVehicle} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search by name or model..." 
            className="w-full pl-8 h-9"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full h-auto grid grid-cols-5 overflow-x-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-1.5">All</TabsTrigger>
            <TabsTrigger value="moving" className="text-xs sm:text-sm py-1.5">Moving</TabsTrigger>
            <TabsTrigger value="stopped" className="text-xs sm:text-sm py-1.5">Stopped</TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs sm:text-sm py-1.5">Inactive</TabsTrigger>
            <TabsTrigger value="immobilized" className="text-xs sm:text-sm py-1.5">Immobilized</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Vehicle Cards */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${selectedTab}-${searchQuery}-${currentPage}`}
          className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {loadingVehicles ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 p-3 border rounded-lg shadow-sm">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            ))
          ) : vehicles.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-8 text-sm">
              No vehicles available. Click "Add Vehicle" to get started.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-8 text-sm">
              No vehicles found for <strong>{selectedTab}</strong> status or search filter.
            </p>
          ) : (
            paginatedVehicles.map((v) => (
              <motion.div
                key={v._id}
                onClick={() => setSelectedVehicle(v)}
                className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
                variants={fadeInUp}
                layout
              >
                <VehicleCard
                  id={v._id}
                  name={v.name}
                  imei={v.imei}
                  licensePlate={v.licensePlate}
                  status={v.currentStatus}
                  speed={v.telemetry.speed}
                  battery={v.telemetry.vehicleBattery}
                  timestamp={v.telemetry.timestamp}
                  onDelete={(id) => {
                    setVehicles((prev) => prev.filter((veh) => veh._id !== id))
                    if (selectedVehicle?._id === id) setSelectedVehicle(null)
                  }}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  )
}