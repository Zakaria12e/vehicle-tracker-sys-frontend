"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 5

interface Vehicle {
  _id: string
  name: string
  licensePlate: string
  model?: string
}

interface Trip {
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

interface TripListProps {
  trips: Trip[]
  onViewTrip: (tripId: string) => void
}

// Utilitaires
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return `${h}h ${m}m`
}

export function TripList({ trips, onViewTrip }: TripListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(trips.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentTrips = trips.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg">Trip List</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Detailed list of all trips in the selected period
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 sm:p-0">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs text-muted-foreground sm:text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Start</th>
                  <th className="px-4 py-3 text-left">End</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Distance</th>
                  <th className="px-4 py-3 text-left">Avg Speed</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTrips.map((trip) => {
                  const startDate = formatDate(trip.startTime)
                  const startTime = formatTime(trip.startTime)
                  const endTime = trip.endTime ? formatTime(trip.endTime) : "--"
                  const duration = formatDuration(trip.summary.duration)
                  const vehicleName = typeof trip.vehicle === "string" ? trip.vehicle : trip.vehicle?.name

                  return (
                    <tr key={trip._id} className="border-b">
                      <td className="px-4 py-3">{vehicleName}</td>
                      <td className="px-4 py-3">{startDate}</td>
                      <td className="px-4 py-3">{startTime}</td>
                      <td className="px-4 py-3">{endTime}</td>
                      <td className="px-4 py-3">{duration}</td>
                      <td className="px-4 py-3">{trip.summary.distance.toFixed(1)} km</td>
                      <td className="px-4 py-3">{trip.summary.averageSpeed.toFixed(1)} km/h</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 px-2"
                          onClick={() => onViewTrip(trip._id)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
