"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Car, Clock, MapPin } from "lucide-react"

// Mock data for different periods
const mockData = {
  week: {
    totalDistance: 395,
    totalTrips: 13,
    drivingTime: 9.5,
    activeDays: 5,
    activeVehicles: 3,
    avgDistancePerDay: 39,
    avgSpeed: 28,
    tripsPerDay: 2.6,
    utilization: 27,
    vehicles: [
      { name: "Toyota Corolla", distance: 85, trips: 6, time: "4h 15m", speed: 31 },
      { name: "Ford Transit", distance: 72, trips: 4, time: "3h 30m", speed: 25 },
      { name: "Honda Civic", distance: 38, trips: 3, time: "1h 45m", speed: 22 }
    ]
  },
  month: {
    totalDistance: 780,
    totalTrips: 52,
    drivingTime: 39,
    activeDays: 13,
    activeVehicles: 4,
    avgDistancePerDay: 18,
    avgSpeed: 30,
    tripsPerDay: 4,
    utilization: 36,
    vehicles: [
      { name: "Toyota Corolla", distance: 250, trips: 18, time: "8h 35m", speed: 33 },
      { name: "Ford Transit", distance: 320, trips: 16, time: "12h 00m", speed: 27 },
      { name: "Honda Civic", distance: 140, trips: 12, time: "6h 40m", speed: 24 },
      { name: "Nissan Sentra", distance: 70, trips: 6, time: "2h 45m", speed: 29 }
    ]
  },
  quarter: {
    totalDistance: 2340,
    totalTrips: 156,
    drivingTime: 117,
    activeDays: 48,
    activeVehicles: 6,
    avgDistancePerDay: 16,
    avgSpeed: 29,
    tripsPerDay: 3.25,
    utilization: 55,
    vehicles: [
      { name: "Toyota Corolla", distance: 720, trips: 48, time: "24h 30m", speed: 32 },
      { name: "Ford Transit", distance: 890, trips: 42, time: "33h 15m", speed: 28 },
      { name: "Honda Civic", distance: 420, trips: 36, time: "16h 20m", speed: 26 },
      { name: "Nissan Sentra", distance: 210, trips: 18, time: "8h 15m", speed: 31 },
      { name: "Hyundai Elantra", distance: 65, trips: 8, time: "2h 45m", speed: 24 },
      { name: "Chevrolet Malibu", distance: 35, trips: 4, time: "1h 35m", speed: 22 }
    ]
  },
  year: {
    totalDistance: 9360,
    totalTrips: 624,
    drivingTime: 468,
    activeDays: 220,
    activeVehicles: 9,
    avgDistancePerDay: 15,
    avgSpeed: 28,
    tripsPerDay: 2.8,
    utilization: 82,
    vehicles: [
      { name: "Toyota Corolla", distance: 2880, trips: 192, time: "102h 30m", speed: 31 },
      { name: "Ford Transit", distance: 3560, trips: 168, time: "134h 15m", speed: 27 },
      { name: "Honda Civic", distance: 1680, trips: 144, time: "68h 20m", speed: 25 },
      { name: "Nissan Sentra", distance: 840, trips: 72, time: "32h 15m", speed: 29 },
      { name: "Hyundai Elantra", distance: 260, trips: 32, time: "11h 45m", speed: 23 },
      { name: "Chevrolet Malibu", distance: 140, trips: 16, time: "6h 35m", speed: 22 },
      { name: "Mazda 3", distance: 0, trips: 0, time: "0h 00m", speed: 0 },
      { name: "Volkswagen Jetta", distance: 0, trips: 0, time: "0h 00m", speed: 0 },
      { name: "Kia Forte", distance: 0, trips: 0, time: "0h 00m", speed: 0 }
    ]
  },
  custom: {
    totalDistance: 1560,
    totalTrips: 104,
    drivingTime: 78,
    activeDays: 28,
    activeVehicles: 5,
    avgDistancePerDay: 17,
    avgSpeed: 29,
    tripsPerDay: 3.7,
    utilization: 45,
    vehicles: [
      { name: "Toyota Corolla", distance: 500, trips: 36, time: "17h 35m", speed: 32 },
      { name: "Ford Transit", distance: 640, trips: 32, time: "24h 00m", speed: 27 },
      { name: "Honda Civic", distance: 280, trips: 24, time: "11h 40m", speed: 25 },
      { name: "Nissan Sentra", distance: 105, trips: 9, time: "4h 15m", speed: 28 },
      { name: "Hyundai Elantra", distance: 35, trips: 3, time: "1h 30m", speed: 23 }
    ]
  }
}

type Period = "week" | "month" | "quarter" | "year" | "custom";

const getPeriodLabel = (period: Period) => {
  const labels: Record<Period, string> = {
    week: "This Week",
    month: "This Month", 
    quarter: "This Quarter",
    year: "This Year",
    custom: "Custom Range (2 months)"
  }
  return labels[period] || "This Month"
}

const getPeriodDescription = (period: Period) => {
  const descriptions: Record<Period, string> = {
    week: "7 days of activity",
    month: "13 days of activity this month",
    quarter: "48 days of activity this quarter", 
    year: "220 days of activity this year",
    custom: "28 days of activity in custom range"
  }
  return descriptions[period] || "13 days of activity this month"
}

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("month")
  const data = mockData[period]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">Analyze your fleet performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalDistance.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground">{getPeriodDescription(period)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTrips} trips</div>
            <p className="text-xs text-muted-foreground">{data.activeVehicles} active vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Driving Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.drivingTime}h</div>
            <p className="text-xs text-muted-foreground">{Math.round(data.drivingTime / data.activeVehicles)}h/day per vehicle</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">By Vehicle</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>{getPeriodLabel(period)} activity summary</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Distance/Day</span>
                    <span className="text-sm text-muted-foreground">{data.avgDistancePerDay} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Speed</span>
                    <span className="text-sm text-muted-foreground">{data.avgSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trips/Day</span>
                    <span className="text-sm text-muted-foreground">{data.tripsPerDay} trips</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Status</CardTitle>
                <CardDescription>Current fleet information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Vehicles</span>
                    <span className="text-sm text-muted-foreground">{data.activeVehicles}/11</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Days of Operation</span>
                    <span className="text-sm text-muted-foreground">{data.activeDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Utilization</span>
                    <span className="text-sm text-muted-foreground">{data.utilization}%</span>
                  </div> 
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Performance</CardTitle>
              <CardDescription>Comparative analysis of all vehicles - {getPeriodLabel(period)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Distance</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Trips</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Driving Time</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Avg. Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.vehicles.map((vehicle, index) => (
                      <tr key={index} className="border-b">
                        <td className="whitespace-nowrap px-4 py-3 font-medium">{vehicle.name}</td>
                        <td className="whitespace-nowrap px-4 py-3">{vehicle.distance} km</td>
                        <td className="whitespace-nowrap px-4 py-3">{vehicle.trips}</td>
                        <td className="whitespace-nowrap px-4 py-3">{vehicle.time}</td>
                        <td className="whitespace-nowrap px-4 py-3">{vehicle.speed} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Driver Performance</CardTitle>
              <CardDescription>Performance by driver</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  <p>Driver data not available</p>
                  <p className="text-sm">Connect your tracking devices to view detailed statistics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Analysis</CardTitle>
              <CardDescription>Analyze routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  <p>Route data not available</p>
                  <p className="text-sm">Enable GPS tracking to view route analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}