import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { TripFilters } from "./components/trip-filters"
import { TripSummary } from "./components/trip-summary"
import { TripMap } from "./components/trip-map"
import { TripList } from "./components/trip-list"

const mockTrips = [
  {
    id: "1",
    vehicle: "Toyota Corolla",
    date: "Apr 30, 2023",
    startTime: "08:15 AM",
    endTime: "09:42 AM",
    duration: "1h 27m",
    distance: "32 km",
    avgSpeed: "37 km/h"
  },
  // ...add more mock trips as needed
]

export default function HistoryPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)

  const handleApplyFilters = () => {
    console.log("Applying filters:", { startDate, endDate, selectedVehicle })
  }

  const handleViewTrip = (tripId: string) => {
    setSelectedTripId(tripId)
  }

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
        startDate={startDate}
        endDate={endDate}
        selectedVehicle={selectedVehicle}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onVehicleChange={setSelectedVehicle}
        onApplyFilters={handleApplyFilters}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <TripMap />
        <TripSummary
          totalDistance={1248}
          totalTrips={42}
          drivingTime="32h 15m"
          averageSpeed={38}
          maxSpeed={112}
        />
      </div>

      <TripList trips={mockTrips} onViewTrip={handleViewTrip} />
    </div>
  )
}
