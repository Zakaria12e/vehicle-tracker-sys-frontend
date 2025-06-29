"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Gauge,
  Battery,
  MapPin,
  Activity,
  ArrowLeft,
  Smartphone,
  Settings,
  Download,
  Route,
  Clock,
  Zap,
  Navigation,
  Satellite,
  Car,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
} from "lucide-react"

const statusColors: Record<
  string,
  { color: string; bg: string; border: string; icon: any }
> = {
  moving: { color: "text-green-400", border: "border-green-500/20",  bg: "bg-green-500/10", icon: TrendingUp },
  stopped: { color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/10", icon: Minus },
  immobilized: { color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/10", icon: XCircle },
  inactive: { color: "text-gray-400", border: "border-gray-500/20", bg: "bg-gray-500/10", icon: AlertTriangle },
}


type VehicleDetails = {
  id: string
  imei: string
  name: string
  model: string
  licensePlate: string
  currentStatus: string
  createdAt: string
  extendedData?: {
    vehicleBattery?: number
    DIN1?: number
    externalVoltageExtanded?: number
    totalOdometer?: number
    tripOdometer?: number
    x?: number
    y?: number
    z?: number
  }
  lastPosition: {
    lat: number
    lon: number
    speed: number
    timestamp: string
    satellites?: number
    ignition?: boolean
  }
}

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-64" />
      </div>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
        const res = await fetch(`${API_URL}/vehicles/${id}`, {
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch vehicle details")
        }

        const json = await res.json()
        setVehicle(json.data.vehicle)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchVehicle()
  }, [id])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Car className="h-5 w-5" />
              <p>Vehicle not found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = statusColors[vehicle.currentStatus] || statusColors.inactive
  const StatusIcon = statusConfig.icon
  const batteryLevel = vehicle.extendedData?.vehicleBattery ?? 0
  const isIgnitionOn = vehicle.extendedData?.DIN1 === 1

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vehicle.name}</h1>
            <p className="text-muted-foreground">
              {vehicle.model} • {vehicle.licensePlate}
            </p>
          </div>
        </div>
       <Badge
  variant="outline"
  className={`text-sm px-3 py-1 ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border} flex items-center`}
>
  <StatusIcon className={`h-4 w-4 mr-1 ${statusConfig.color}`} />
  {vehicle.currentStatus.charAt(0).toUpperCase() + vehicle.currentStatus.slice(1)}
</Badge>

      </div>

      {/* Status Overview - Hero Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Status
          </CardTitle>
          <CardDescription>Real-time vehicle monitoring and diagnostics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Speed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4" />
                Current Speed
              </div>
              <div className="text-1xl font-bold">
                {vehicle.lastPosition?.speed ?? 0}
                <span className="text-sm font-normal text-muted-foreground ml-1">km/h</span>
              </div>
            </div>

            {/* Battery */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Battery className="h-4 w-4" />
                Battery Level
              </div>
              <div className="space-y-2">
                <div className="text-1xl font-bold flex items-center">
                  {batteryLevel}
                  <span className="text-sm font-normal text-muted-foreground ml-1">%</span>
                  <Progress value={batteryLevel} className="h-2 w-20 ml-2" />
                </div>
                
              </div>
            </div>

            {/* Ignition */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                Ignition Status
              </div>
              <div className="flex items-center gap-2">
                {isIgnitionOn ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-semibold">{isIgnitionOn ? "On" : "Off"}</span>
              </div>
            </div>

            {/* Last Update */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last Update
              </div>
              <div className="text-1xl font-semibold">{getRelativeTime(vehicle.lastPosition.timestamp)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">License Plate</span>
                <span className="font-mono font-semibold">{vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">IMEI</span>
                <span className="font-mono text-sm">{vehicle.imei}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Registration Date</span>
                <span className="font-medium">
                  {new Date(vehicle.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Latitude</span>
                <span className="font-mono text-sm">{vehicle.lastPosition.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Longitude</span>
                <span className="font-mono text-sm">{vehicle.lastPosition.lon.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Satellite className="h-3 w-3" />
                  Satellites
                </span>
                <span className="font-medium">{vehicle.lastPosition.satellites ?? "--"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extended Sensor Data */}
      {vehicle.extendedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Sensor Diagnostics
            </CardTitle>
            <CardDescription>Advanced telemetry and sensor readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Voltage */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  External Voltage
                </div>
                <div className="text-xl font-semibold">
                  {vehicle.extendedData.externalVoltageExtanded ?? "--"}
                  <span className="text-sm font-normal text-muted-foreground ml-1">V</span>
                </div>
              </div>

              {/* Total Odometer */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Route className="h-4 w-4" />
                  Total Distance
                </div>
                <div className="text-xl font-semibold">
                  {vehicle.extendedData.totalOdometer !== undefined
                    ? (vehicle.extendedData.totalOdometer / 1000).toLocaleString("en-US", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })
                    : "--"}
                  <span className="text-sm font-normal text-muted-foreground ml-1">km</span>
                </div>
              </div>

              {/* Trip Odometer */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  Trip Distance
                </div>
                <div className="text-xl font-semibold">
                  {vehicle.extendedData.tripOdometer !== undefined
                    ? (vehicle.extendedData.tripOdometer / 1000).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "--"}
                  <span className="text-sm font-normal text-muted-foreground ml-1">km</span>
                </div>
              </div>

              {/* Acceleration Data */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Activity className="h-4 w-4" />
                  Acceleration Sensors
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">X-Axis</div>
                    <div className="text-lg font-semibold">{vehicle.extendedData.x ?? "--"}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Y-Axis</div>
                    <div className="text-lg font-semibold">{vehicle.extendedData.y ?? "--"}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Z-Axis</div>
                    <div className="text-lg font-semibold">{vehicle.extendedData.z ?? "--"}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Manage and monitor your vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-12 justify-start bg-transparent"
              onClick={() => navigate(`/track/${vehicle.imei}`)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Live Tracking
            </Button>
            <Button
              variant="outline"
              className="h-12 justify-start bg-transparent"
              onClick={() => navigate(`/dashboard/history?vehicle=${id}`)}
            >
              <Route className="h-4 w-4 mr-2" />
              Trip History
            </Button>
            <Button variant="outline" className="h-12 justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="h-12 justify-start bg-transparent"
              onClick={() => navigate(`/dashboard/vehicles/${id}/edit`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Vehicle Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
