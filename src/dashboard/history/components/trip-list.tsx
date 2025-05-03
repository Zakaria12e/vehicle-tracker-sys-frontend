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
      <CardHeader>
        <CardTitle>Trip List</CardTitle>
        <CardDescription>Detailed list of all trips in the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
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
            <tbody>
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
                      <Button variant="ghost" size="sm" className="gap-1">
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
      </CardContent>
    </Card>
  )
}
