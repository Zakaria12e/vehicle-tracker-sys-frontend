import type React from "react"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Battery, Gauge, Power, MapPin } from "lucide-react"
import { renderToStaticMarkup } from "react-dom/server"

// Define center point (Morocco)
const defaultCenter: [number, number] = [31.7917, -7.0926]

type Props = {
  devices: any[] // Array of vehicle data
  selectedVehicle: string // IMEI or "all"
}


const createCustomMarker = (status: string) => {

  const getColor = () => {
    switch (status) {
      case "moving":
        return "#10b981"
      case "stopped":
        return "#f59e0b"
      case "inactive":
        return "#6b7280"
      default:
        return "#ef4444"
    }
  }

  const iconMarkup = renderToStaticMarkup(
    <div className="relative">
      <MapPin size={36} color={getColor()} fill={getColor()} fillOpacity={0.4} strokeWidth={2} />
    </div>,
  )

 
  return L.divIcon({
    html: iconMarkup,
    className: "custom-vehicle-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

const VehicleMap: React.FC<Props> = ({ devices, selectedVehicle }) => {
  const visibleDevices = devices.filter((v) => selectedVehicle === "all" || v.imei === selectedVehicle)

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "moving":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            {status}
          </Badge>
        )
      case "stopped":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
            {status}
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">
            {status}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
            {status}
          </Badge>
        )
    }
  }

  return (
    <MapContainer center={defaultCenter} zoom={6} className="h-full w-full z-0 rounded-lg shadow-sm">
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visibleDevices.map((v) => (
        <Marker key={v.imei} position={[v.lat, v.lon]} icon={createCustomMarker(v.currentStatus)}>
          <Popup>
            <Card className="border-0 shadow-none w-[250px] dark:bg-black">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-base flex items-center gap-1.5">
                    <Car className="h-4 w-4" />
                    {v.name}
                  </div>
                  {getStatusBadge(v.currentStatus)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">IMEI</span>
                    </span>
                    <span className="font-mono text-xs">{v.imei}</span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Speed</span>
                    </span>
                    <span>{v.telemetry.speed ?? 0} km/h</span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Battery className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Battery</span>
                    </span>
                    <span>{v.telemetry.vehicleBattery ?? "--"}%</span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Power className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Ignition</span>
                    </span>
                    <span>{v.telemetry.ignition ? "On" : "Off"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default VehicleMap