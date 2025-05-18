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
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Trip Details</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">{trip.vehicle} • {trip.date}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid gap-4">
          <div className="h-[250px] w-full sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <Suspense fallback={<MapLoading />}>
              {/* Trip map will go here */}
              <div className="h-full w-full flex items-center justify-center bg-muted/20">
                <p className="text-sm text-muted-foreground">Trip map placeholder</p>
              </div>
            </Suspense>
          </div>
          
          {/* Mobile view - vertical layout */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:hidden">
            <TripDetailItem label="Start Time" value={trip.startTime} />
            <TripDetailItem label="End Time" value={trip.endTime} />
            <TripDetailItem label="Duration" value={trip.duration} />
            <TripDetailItem label="Distance" value={trip.distance} />
            <TripDetailItem label="Avg. Speed" value={trip.avgSpeed} />
            <TripDetailItem label="Max Speed" value="65 km/h" />
            <TripDetailItem label="Stops" value="2" />
            <TripDetailItem label="Idle Time" value="15m" />
          </div>

          {/* Tablet/Desktop view - horizontal layout */}
          <div className="hidden grid-cols-2 gap-4 text-sm sm:grid md:grid-cols-4">
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
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent sm:h-8 sm:w-8"></div>
      <p className="text-xs sm:text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
)