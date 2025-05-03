import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TripSummaryProps {
  totalDistance: number
  totalTrips: number
  drivingTime: string
  averageSpeed: number
  maxSpeed: number
}

export function TripSummary({ totalDistance, totalTrips, drivingTime, averageSpeed, maxSpeed }: TripSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Summary</CardTitle>
        <CardDescription>Statistics for selected period</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Total Distance</div>
          <div className="text-2xl font-bold">{totalDistance} km</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Total Trips</div>
          <div className="text-2xl font-bold">{totalTrips}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Driving Time</div>
          <div className="text-2xl font-bold">{drivingTime}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Average Speed</div>
          <div className="text-2xl font-bold">{averageSpeed} km/h</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Max Speed</div>
          <div className="text-2xl font-bold">{maxSpeed} km/h</div>
        </div>
      </CardContent>
    </Card>
  )
}
