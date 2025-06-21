import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { TripFilters } from "./components/trip-filters"
import { TripSummary } from "./components/trip-summary"
import { TripMap } from "./components/trip-map"
import { TripList } from "./components/trip-list"

type Vehicle = {
  _id: string
  name: string
  licensePlate: string
  model?: string
}

type Trip = {
  _id: string
  vehicle: Vehicle | string
  startTime: string
  endTime?: string
  summary: {
    distance: number
    duration: number
    averageSpeed: number
    maxSpeed: number
  }
  startLocation: {
    coordinates: [number, number]
    timestamp: string
  }
  endLocation?: {
    coordinates: [number, number]
    timestamp: string
  }
}

export default function HistoryPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${API_URL}/vehicles`, { credentials: "include" })
        const json = await res.json()
        setVehicles(json.data?.vehicles || [])
      } catch (err) {
        console.error("Failed to load vehicles:", err)
      }
    }
    fetchVehicles()
  }, [API_URL])

  const handleApplyFilters = async () => {
    if (!startDate || !endDate) return
    setLoading(true)

    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      if (selectedVehicle !== "all") {
        params.append("vehicleId", selectedVehicle)
      }

      const res = await fetch(`${API_URL}/trips/filter?${params.toString()}`, {
        credentials: "include"
      })
      const data = await res.json()
      setTrips(data)
    } catch (err) {
      console.error("Failed to fetch trips:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewTrip = (tripId: string) => {
    setSelectedTripId(tripId)
  }
  function formatDrivingTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`
  if (hours > 0) return `${hours}h`
  return `${minutes}min`
}


  // 🔢 Compute summary
  const totalDistance = trips.reduce((acc, t) => acc + (t.summary?.distance || 0), 0)
  const totalDurationMin = trips.reduce((acc, t) => acc + (t.summary?.duration || 0), 0)
 const drivingTime = formatDrivingTime(totalDurationMin)

  const averageSpeed =
    trips.length > 0
      ? Math.round(
          trips.reduce((acc, t) => acc + (t.summary?.averageSpeed || 0), 0) / trips.length
        )
      : 0
  const maxSpeed = Math.max(...trips.map(t => t.summary?.maxSpeed || 0))

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trip History</h1>
          <p className="text-muted-foreground">View and analyze past trips</p>
        </div>
        <Button variant="outline" className="gap-1">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <TripFilters
        vehicles={vehicles}
        startDate={startDate}
        endDate={endDate}
        selectedVehicle={selectedVehicle}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onVehicleChange={setSelectedVehicle}
        onApplyFilters={handleApplyFilters}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <TripMap selectedTripId={selectedTripId} allTrips={trips} />
        <TripSummary
          totalDistance={totalDistance}
          totalTrips={trips.length}
          drivingTime={drivingTime}
          averageSpeed={averageSpeed}
          maxSpeed={maxSpeed}
        />
      </div>

      <TripList trips={trips} onViewTrip={handleViewTrip} />
    </div>
  )
}
