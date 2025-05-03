import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Locate } from "lucide-react"

interface TrackingHeaderProps {
  selectedVehicle: string
  onVehicleSelect: (value: string) => void
}

export function TrackingHeader({ selectedVehicle, onVehicleSelect }: TrackingHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div>
        <h1 className="text-xl font-bold">Live Tracking</h1>
        <p className="text-sm text-muted-foreground">Monitor your vehicles in real-time</p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={selectedVehicle} onValueChange={onVehicleSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="toyota">Toyota Corolla</SelectItem>
            <SelectItem value="ford">Ford Transit</SelectItem>
            <SelectItem value="honda">Honda Civic</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Locate className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
  