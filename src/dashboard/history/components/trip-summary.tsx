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
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg">Trip Summary</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Statistics for selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-1">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground sm:text-sm">Total Distance</div>
           <div className="text-lg font-bold sm:text-xl md:text-2xl">{totalDistance.toFixed(2)} km</div>

          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground sm:text-sm">Total Trips</div>
            <div className="text-lg font-bold sm:text-xl md:text-2xl">{totalTrips}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground sm:text-sm">Driving Time</div>
            <div className="text-lg font-bold sm:text-xl md:text-2xl">{drivingTime}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground sm:text-sm">Average Speed</div>
            <div className="text-lg font-bold sm:text-xl md:text-2xl">{averageSpeed.toFixed(2)} km/h</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground sm:text-sm">Max Speed</div>
            <div className="text-lg font-bold sm:text-xl md:text-2xl">{maxSpeed.toFixed(2)} km/h</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}