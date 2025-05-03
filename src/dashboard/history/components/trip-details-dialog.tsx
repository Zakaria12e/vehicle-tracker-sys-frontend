import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Suspense } from "react"

interface TripDetailsDialogProps {
  children: React.ReactNode
  trip: {
    vehicle: string
    date: string
    startTime: string
    endTime: string
    duration: string
    distance: string
    avgSpeed: string
  }
}

export function TripDetailsDialog({ children, trip }: TripDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Trip Details</DialogTitle>
          <DialogDescription>{trip.vehicle} • {trip.date}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="h-[400px] w-full">
            <Suspense fallback={<MapLoading />}>
              {/* Trip map will go here */}
              <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                <p className="text-muted-foreground">Trip map placeholder</p>
              </div>
            </Suspense>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <TripDetailItem label="Start Time" value={trip.startTime} />
            <TripDetailItem label="End Time" value={trip.endTime} />
            <TripDetailItem label="Duration" value={trip.duration} />
            <TripDetailItem label="Distance" value={trip.distance} />
            <TripDetailItem label="Avg. Speed" value={trip.avgSpeed} />
            <TripDetailItem label="Max Speed" value="65 km/h" />
            <TripDetailItem label="Stops" value="2" />
            <TripDetailItem label="Idle Time" value="15m" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TripDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span>
      <p className="font-medium">{value}</p>
    </div>
  )
}

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/20">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
)
