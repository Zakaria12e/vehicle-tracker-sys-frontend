"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Route,
  Battery,
  Gauge,
  Calendar,
  Smartphone,
  Car,
  Clock,
  Activity,
  Settings,
  Download,
} from "lucide-react"
import getRelativeTime from "@/components/relativeTime"

// Status variants for badges
const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  moving: "default",
  stopped: "secondary",
  immobilized: "destructive",
  inactive: "outline",
}

type VehicleDetails = {
  id: string
  imei: string
  name: string
  licensePlate: string
  currentStatus: "moving" | "stopped" | "immobilized" | "inactive"
  speed: number
  extendedData:{
    vehicleBattery: number
  }
  timestamp: string
  // Additional details that might be available
  location?: string
  odometer?: number
  fuelLevel?: number
  engineHours?: number
  lastMaintenance?: string
  driver?: string
}

const API_URL = import.meta.env.VITE_API_URL

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchVehicleDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch vehicle details");
      }
      const json = await res.json();
      setVehicle(json.data.vehicle);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchVehicleDetails();
  }
}, [id]);


  const handleTrack = () => {
    if (vehicle) {
      navigate(`/track/${vehicle.imei}`)
    }
  }

  const handleHistory = () => {
    navigate(`/dashboard/history?vehicle=${id}`)
  }

  const handleEdit = () => {
    navigate(`/dashboard/vehicles/${id}/edit`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">The requested vehicle could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vehicle.name}</h1>
            <p className="text-muted-foreground">{vehicle.licensePlate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleTrack}>
            <MapPin className="h-4 w-4 mr-2" />
            Track Live
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={statusVariants[vehicle.currentStatus]} className="capitalize">
                {vehicle.currentStatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Speed</p>
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{vehicle.speed} km/h</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Battery</p>
              <div className="flex items-center gap-1">
                <Battery className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{vehicle.extendedData.vehicleBattery}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Last Update</p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{getRelativeTime(vehicle.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Name</p>
                <p className="font-medium">{vehicle.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">License Plate</p>
                <p className="font-medium">{vehicle.licensePlate}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">IMEI</p>
                <p className="font-medium font-mono text-sm">{vehicle.imei}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle ID</p>
                <p className="font-medium font-mono text-sm">{vehicle.id}</p>
              </div>
            </div>
            {vehicle.location && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p className="font-medium">{vehicle.location}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle.odometer && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Odometer</p>
                  <p className="font-medium">{vehicle.odometer.toLocaleString()} km</p>
                </div>
                {vehicle.engineHours && (
                  <div>
                    <p className="text-sm text-muted-foreground">Engine Hours</p>
                    <p className="font-medium">{vehicle.engineHours}h</p>
                  </div>
                )}
              </div>
            )}
            {vehicle.fuelLevel && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Level</p>
                  <p className="font-medium">{vehicle.fuelLevel}%</p>
                </div>
              </>
            )}
            {vehicle.driver && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Driver</p>
                  <p className="font-medium">{vehicle.driver}</p>
                </div>
              </>
            )}
            {vehicle.lastMaintenance && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Last Maintenance</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{getRelativeTime(vehicle.lastMaintenance)}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage and monitor your vehicle with these quick actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={handleTrack} className="h-auto p-4 flex-col gap-2 bg-transparent">
              <MapPin className="h-5 w-5" />
              <span>Live Tracking</span>
            </Button>
            <Button variant="outline" onClick={handleHistory} className="h-auto p-4 flex-col gap-2 bg-transparent">
              <Route className="h-5 w-5" />
              <span>View History</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" onClick={handleEdit} className="h-auto p-4 flex-col gap-2 bg-transparent">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
