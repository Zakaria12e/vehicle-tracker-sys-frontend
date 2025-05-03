import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Lock } from "lucide-react"

interface VehicleCardProps {
  name: string
  plate: string
  status: "moving" | "idle" | "offline"
  location: string
  speed: string | number
}

export function VehicleCard({ name, plate, status, location, speed }: VehicleCardProps) {
  const statusColors = {
    moving: "green",
    idle: "amber",
    offline: "red",
  }

  const color = statusColors[status]

  return (
    <Card className={`border-l-4 border-l-${color}-500`}>
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <div className={`flex h-2 w-2 rounded-full bg-${color}-500`} />
        </div>
        <CardDescription>{plate} • {status.charAt(0).toUpperCase() + status.slice(1)}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{typeof speed === "number" ? `${speed} km/h` : speed}</span>
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <Button variant="outline" size="sm">Details</Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            disabled={status === "offline"}
          >
            <Lock className="h-3 w-3" />
            Immobilize
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
