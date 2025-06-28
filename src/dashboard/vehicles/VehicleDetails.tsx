"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Gauge,
  Battery,
  MapPin,
  Calendar,
  Activity,
  ArrowLeft,
  Smartphone,
  Settings,
  Download,
  Route,
  Clock,
} from "lucide-react";
import getRelativeTime from "@/components/relativeTime";

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  moving: "default",
  stopped: "secondary",
  immobilized: "destructive",
  inactive: "outline",
};

type VehicleDetails = {
  id: string;
  imei: string;
  name: string;
  model: string;
  licensePlate: string;
  currentStatus: string;
  createdAt: string;
  extendedData?: {
    vehicleBattery?: number;
    DIN1?: number;
    externalVoltageExtanded?: number;
    totalOdometer?: number;
    tripOdometer?: number;
    x?: number;
    y?: number;
    z?: number;
  };
  lastPosition: {
    lat: number;
    lon: number;
    speed: number;
    timestamp: string;
    satellites?: number;
    ignition?: boolean;
  };
};

const API_URL = import.meta.env.VITE_API_URL;

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${API_URL}/vehicles/${id}`, {
          credentials: "include",
        });
        const json = await res.json();
        setVehicle(json.data.vehicle);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVehicle();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading vehicle details...</div>;
  }

  if (!vehicle) {
    return <div className="p-6">Vehicle not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {vehicle.name} ({vehicle.model})
        </h1>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              variant={statusColors[vehicle.currentStatus]}
              className="capitalize"
            >
              {vehicle.currentStatus}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Speed</p>
            <div className="flex items-center gap-1">
              <Gauge size={16} /> {vehicle.lastPosition?.speed ?? 0} km/h
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Battery</p>
            <div className="flex items-center gap-1">
              <Battery size={16} />{" "}
              {vehicle.extendedData?.vehicleBattery ?? "--"}%
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Update</p>
            <div className="flex items-center gap-1">
              <Clock size={16} />{" "}
              {getRelativeTime(vehicle.lastPosition.timestamp)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">License Plate</p>
            <p className="font-medium">{vehicle.licensePlate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">IMEI</p>
            <p className="font-mono text-sm">{vehicle.imei}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Extended Data */}
      {vehicle.extendedData && (
        <Card>
          <CardHeader>
            <CardTitle>Device Sensors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ignition</p>
              <p>
                {vehicle.extendedData.DIN1 !== undefined
                  ? vehicle.extendedData.DIN1 === 1
                    ? "On"
                    : "Off"
                  : "--"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">External Voltage</p>
              <p>{vehicle.extendedData.externalVoltageExtanded ?? "--"} V</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Odometer</p>
              <p>
                {vehicle.extendedData.totalOdometer !== undefined
                  ? (vehicle.extendedData.totalOdometer / 1000).toFixed(2) +
                    " km"
                  : "--"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Trip Odometer</p>
              <p>
                {vehicle.extendedData.tripOdometer !== undefined
                  ? (vehicle.extendedData.tripOdometer / 1000).toFixed(2) +
                    " km"
                  : "--"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                X/Y/Z Acceleration
              </p>
              <p>
                X: {vehicle.extendedData.x ?? "--"} | Y:{" "}
                {vehicle.extendedData.y ?? "--"} | Z:{" "}
                {vehicle.extendedData.z ?? "--"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Location */}
      {vehicle.lastPosition && (
        <Card>
          <CardHeader>
            <CardTitle>Last Known Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coordinates:</p>
            <p>
              <MapPin className="inline mr-1" size={16} /> Lat:{" "}
              {vehicle.lastPosition.lat}, Lon: {vehicle.lastPosition.lon}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/track/${vehicle.imei}`)}
          >
            <MapPin className="h-4 w-4 mr-1" /> Track Live
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/history?vehicle=${id}`)}
          >
            <Route className="h-4 w-4 mr-1" /> View History
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" /> Export Data
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/vehicles/${id}/edit`)}
          >
            <Settings className="h-4 w-4 mr-1" /> Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
