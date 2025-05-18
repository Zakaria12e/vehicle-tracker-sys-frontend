import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { TripDetailsDialog } from "./trip-details-dialog"

interface Trip {
  id: string
  vehicle: string
  date: string
  startTime: string
  endTime: string
  duration: string
  distance: string
  avgSpeed: string
}

interface TripListProps {
  trips: Trip[]
  onViewTrip: (tripId: string) => void
}

export function TripList({ trips, onViewTrip }: TripListProps) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg">Trip List</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Detailed list of all trips in the selected period</CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-0">
        {/* Mobile view - Card layout */}
        <div className="grid gap-2 p-4 sm:hidden">
          {trips.map((trip) => (
            <div key={trip.id} className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{trip.vehicle}</div>
                <TripDetailsDialog trip={trip}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </TripDetailsDialog>
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <div className="text-muted-foreground">Date:</div>
                <div>{trip.date}</div>
                <div className="text-muted-foreground">Time:</div>
                <div>{trip.startTime} - {trip.endTime}</div>
                <div className="text-muted-foreground">Duration:</div>
                <div>{trip.duration}</div>
                <div className="text-muted-foreground">Distance:</div>
                <div>{trip.distance}</div>
                <div className="text-muted-foreground">Avg. Speed:</div>
                <div>{trip.avgSpeed}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet and desktop view - Table layout */}
        <div className="hidden sm:block">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs text-muted-foreground sm:text-sm">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Date</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Start Time</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">End Time</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Duration</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Distance</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Avg. Speed</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b">
                    <td className="whitespace-nowrap px-4 py-3">{trip.vehicle}</td>
                    <td className="whitespace-nowrap px-4 py-3">{trip.date}</td>
                    <td className="whitespace-nowrap px-4 py-3">{trip.startTime}</td>
                    <td className="whitespace-nowrap px-4 py-3">{trip.endTime}</td>
                    <td className="whitespace-nowrap px-4 py-3">{trip.duration}</td>
                    <td className="whitespace-nowrap px-4 py-3">{trip.distance}</td>
                    <td className="whitespace-nowrap px-4 py-3">{trip.avgSpeed}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <TripDetailsDialog trip={trip}>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </TripDetailsDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}