import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

interface TripMapProps {
  selectedTripId?: string | null
}

export function TripMap({ selectedTripId }: TripMapProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Trip Map</CardTitle>
        <CardDescription>Visualization of selected trips</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Suspense fallback={<MapLoading />}>
          {/* Map component will go here */}
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
            <p className="text-muted-foreground">Map placeholder</p>
          </div>
        </Suspense>
      </CardContent>
    </Card>
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
