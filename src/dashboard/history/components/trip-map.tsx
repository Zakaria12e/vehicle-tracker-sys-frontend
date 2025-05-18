import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

interface TripMapProps {
  selectedTripId?: string | null
}

export function TripMap({ selectedTripId }: TripMapProps) {
  return (
    <Card className="w-full lg:col-span-2">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg">Trip Map</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Visualization of selected trips</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] p-0 sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <Suspense fallback={<MapLoading />}>
          {/* Map component will go here */}
          <div className="h-full w-full flex items-center justify-center bg-muted/20">
            <p className="text-sm text-muted-foreground">Map placeholder</p>
          </div>
        </Suspense>
      </CardContent>
    </Card>
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