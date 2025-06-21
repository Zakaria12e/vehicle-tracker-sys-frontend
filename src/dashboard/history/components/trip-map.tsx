import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Polyline,
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
import { CircleMarker } from "react-leaflet"

const defaultCenter: [number, number] = [31.7917, -7.0926]

const MapAutoZoom = ({ bounds }: { bounds: [[number, number], [number, number]] | null }) => {
  const map = useMap()
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { animate: true, duration: 1.5 })
    }
  }, [bounds, map])
  return null
}

interface Position {
  location: {
    type: string
    coordinates: [number, number]
  }
  createdAt: string
  speed: number
}

interface Trip {
  _id: string
}

interface TripMapProps {
  selectedTripId: string | null
  allTrips: Trip[]
}

export function TripMap({ selectedTripId, allTrips }: TripMapProps) {
  const [positions, setPositions] = useState<[number, number][][]>([])
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchAllPositions = async () => {
      if (!allTrips.length) {
        setPositions([])
        setBounds(null)
        return
      }

      const allCoords: [number, number][][] = []

      for (const trip of allTrips) {
        try {
          const res = await fetch(`${API_URL}/trips/positions/byTrip/${trip._id}`, {
            credentials: "include",
          })
          const data: Position[] = await res.json()

          const coords = data
            .map(p => [p.location.coordinates[1], p.location.coordinates[0]])
            .filter((c): c is [number, number] =>
              c.length === 2 && c.every(n => typeof n === "number"))

          if (coords.length > 0) {
            allCoords.push(coords)
          }
        } catch (err) {
          console.error(`Failed to load positions for trip ${trip._id}:`, err)
        }
      }

      const flat = allCoords.flat()
      setPositions(allCoords)

      if (flat.length > 1) {
        const lats = flat.map(c => c[0])
        const lons = flat.map(c => c[1])
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLon = Math.min(...lons)
        const maxLon = Math.max(...lons)
        setBounds([[minLat, minLon], [maxLat, maxLon]])
      } else {
        setBounds(null)
      }
    }

    fetchAllPositions()
  }, [allTrips, API_URL])

  return (
    <Card className="w-full lg:col-span-2">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg">Trip Map</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          All filtered trip routes are shown
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

         {positions.map((line, idx) => {
  const isSelected = allTrips[idx]?._id === selectedTripId

  return (
    <>
      <Polyline
        key={`poly-${idx}`}
        positions={line}
        pathOptions={{
          color: isSelected ? '#8200db' : '#00a6f4',
          weight: 4,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: "6 4",
        }}
      />

      {/* Start point marker */}
      {line.length > 0 && (
        <CircleMarker
  key={`start-${idx}`}
  center={line[0]}
  radius={4} // smaller radius
  pathOptions={{
    color: '#22c55e',       // Tailwind green-500
    fillColor: '#22c55e',
    fillOpacity: 1,
    weight: 1,              // thinner border
  }}
/>

      )}
    </>
  )
})}


          <MapAutoZoom bounds={bounds} />
        </MapContainer>
      </CardContent>
    </Card>
  )
}
