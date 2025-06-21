import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Car, Clock, Gauge, MapPin, Route } from "lucide-react"

interface TripSummaryProps {
  totalDistance: number
  totalTrips: number
  drivingTime: string
  averageSpeed: number
  maxSpeed: number
  loading?: boolean
}

export function TripSummary({
  totalDistance,
  totalTrips,
  drivingTime,
  averageSpeed,
  maxSpeed,
  loading = false,
}: TripSummaryProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-40 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      label: "Total Distance",
      value: `${totalDistance.toFixed(1)} km`,
      icon: Route,
    },
    {
      label: "Total Trips",
      value: totalTrips.toString(),
      icon: Car,
    },
    {
      label: "Driving Time",
      value: drivingTime,
      icon: Clock,
    },
    {
      label: "Average Speed",
      value: `${averageSpeed.toFixed(1)} km/h`,
      icon: Gauge,
    },
    {
      label: "Max Speed",
      value: `${maxSpeed.toFixed(1)} km/h`,
      icon: MapPin,
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Trip Summary</CardTitle>
        <CardDescription>Statistics for selected period</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.label}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold leading-none">{stat.value}</p>
                </div>
              </div>
              {index < stats.length - 1 && <Separator className="mt-4" />}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
