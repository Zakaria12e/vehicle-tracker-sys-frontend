import { useEffect,  } from "react"
import {
  MapContainer,
  TileLayer,
  useMap
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const defaultCenter: [number, number] = [31.7917, -7.0926]



const MapAutoZoom = ({ bounds }: { bounds: [[number, number], [number, number]] | null }) => {
  const map = useMap()
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { animate: true, duration: 2 })
    }
  }, [bounds, map])
  return null
}

export function TripMap() {

  return (
    <Card className="w-full lg:col-span-2">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg">Trip Map</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Selected trip route visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] p-0 sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <MapContainer center={defaultCenter} zoom={6} className="h-full w-full rounded-lg">
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            className="hidden dark:block"
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
         
      
        </MapContainer>
      </CardContent>
    </Card>
  )
}
