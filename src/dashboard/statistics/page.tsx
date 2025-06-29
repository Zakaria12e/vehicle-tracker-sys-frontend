"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, Car, Clock, MapPin, TrendingUp, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Area, AreaChart, XAxis, YAxis , ResponsiveContainer } from "recharts"
import VehiclePlacesHeatmap from "./components/VehiclePlacesHeatmap";

type Period = "today" | "thisWeek" | "thisMonth" | "thisYear"


export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("thisMonth")
  const [overview, setOverview] = useState<any>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [tripAnalytics, setTripAnalytics] = useState<any[]>([])
  const [fleetStatus, setFleetStatus] = useState<any>(null)
  const [loadingOverview, setLoadingOverview] = useState(false)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [loadingFleetStatus, setLoadingFleetStatus] = useState(false)
  const [COLORS, setCOLORS] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const vehiclesPerPage = 5

  const API_URL = import.meta.env.VITE_API_URL



useEffect(() => {
  const root = document.documentElement;
  setCOLORS([
    getComputedStyle(root).getPropertyValue("--chart-1").trim(),
    getComputedStyle(root).getPropertyValue("--chart-2").trim(),
    getComputedStyle(root).getPropertyValue("--chart-3").trim(),
    getComputedStyle(root).getPropertyValue("--chart-4").trim(),
    getComputedStyle(root).getPropertyValue("--chart-5").trim(),
    getComputedStyle(root).getPropertyValue("--inactive").trim(),
  ]);
}, []);


  useEffect(() => {
    const fetchOverview = async () => {
      setLoadingOverview(true)
      try {
        const res = await fetch(`${API_URL}/statistics/overview?period=${period}`, { credentials: "include" })
        const json = await res.json()
        setOverview(json.data)
      } catch (error) {
        console.error("Error fetching overview:", error)
      } finally {
        setLoadingOverview(false)
      }
    }

    const fetchVehicles = async () => {
      setLoadingVehicles(true)
      try {
        const res = await fetch(`${API_URL}/statistics/vehicles?period=${period}`, { credentials: "include" })
        const json = await res.json()
        setVehicles(json.data)
        setCurrentPage(1)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
      } finally {
        setLoadingVehicles(false)
      }
    }

    const fetchTripAnalytics = async () => {
      setLoadingAnalytics(true)
      try {
        const groupBy = period === "today" ? "hour" : "day"
        const res = await fetch(`${API_URL}/statistics/trip-analytics?period=${period}&groupBy=${groupBy}`, {
          credentials: "include",
        })
        const json = await res.json()
        setTripAnalytics(json.data)
      } catch (error) {
        console.error("Error fetching trip analytics:", error)
      } finally {
        setLoadingAnalytics(false)
      }
    }


    fetchOverview()
    fetchVehicles()
    fetchTripAnalytics()
  }, [period])

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage)
  const startIndex = (currentPage - 1) * vehiclesPerPage
  const endIndex = startIndex + vehiclesPerPage

  // Sort vehicles by totalDistance (biggest first)
  const sortedVehicles = [...vehicles].sort((a, b) => b.totalDistance - a.totalDistance)
  const currentVehicles = sortedVehicles.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1)
  }

  // Prepare fleet status data for pie chart
  const fleetStatusData = fleetStatus
    ? [
        { name: "Moving", value: fleetStatus.statusBreakdown.moving, color: COLORS[1] },
        { name: "Stopped", value: fleetStatus.statusBreakdown.stopped, color: COLORS[2] },
        { name: "Inactive", value: fleetStatus.statusBreakdown.inactive, color: COLORS[5] },
        { name: "Immobilized", value: fleetStatus.statusBreakdown.immobilized, color: COLORS[4] },
      ].filter((item) => item.value > 0)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6 p-4 md:p-8"
    >
      {/* Header */}
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
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Distance", icon: MapPin, value: overview?.totalDistance, unit: "km" },
          { title: "Total Trips", icon: Car, value: overview?.totalTrips, unit: "trips" },
          { title: "Driving Time", icon: Clock, value: overview?.totalDrivingTime, unit: "h" },
          { title: "Active Vehicles", icon: Activity, value: overview?.activeVehicles, unit: "vehicles" },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingOverview || loadingFleetStatus ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  `${item.value || 0} ${item.unit}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {item.title === "Total Distance" && `${overview?.daysOfOperation || 0} active days`}
                {item.title === "Total Trips" && `${overview?.activeVehicles || 0} active vehicles`}
                {item.title === "Driving Time" && `Utilization: ${overview?.utilization || 0}%`}
                {item.title === "Active Vehicles" && `${overview?.utilization || 0}% utilization`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
       <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="text-xs sm:text-sm py-2">
                  Vehicles
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="heatmap" className="text-xs sm:text-sm py-2">
                  Heatmap
                </TabsTrigger>
              </TabsList>
            </div>

 <TabsContent value="overview" className="p-6 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trip Analytics
                    </CardTitle>
                    <CardDescription>Distance and trips over time - {period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingAnalytics ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ChartContainer
                            config={{
                              distance: { label: "Distance (km)", color: COLORS[0] },
                              trips: { label: "Trips", color: COLORS[1] },
                            }}
                            className="h-full w-full"
                          >
                            <AreaChart data={tripAnalytics}>
                              <XAxis
                                dataKey="period"
                                tickFormatter={(value) =>
                                  period === "today" ? value.split(" ")[1] : value.split("-").slice(1).join("/")
                                }
                                fontSize={12}
                              />
                              <YAxis fontSize={12} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="totalDistance"
                                stackId="1"
                                stroke={COLORS[0]}
                                fill={COLORS[0]}
                                fillOpacity={0.6}
                              />
                              <Area
                                type="monotone"
                                dataKey="tripCount"
                                stackId="2"
                                stroke={COLORS[1]}
                                fill={COLORS[1]}
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ChartContainer>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>



        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Performance</CardTitle>
              <CardDescription>Comparative analysis of all vehicles - {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Vehicle</th>
                      <th className="px-4 py-3 text-left">Distance</th>
                      <th className="px-4 py-3 text-left">Trips</th>
                      <th className="px-4 py-3 text-left">Driving Time</th>
                      <th className="px-4 py-3 text-left">Avg. Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingVehicles
                      ? Array.from({ length: vehiclesPerPage }).map((_, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-32" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-12" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-16" />
                            </td>
                          </tr>
                        ))
                      : currentVehicles.map((v, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-4 py-3 font-medium">{v.vehicleName}</td>
                            <td className="px-4 py-3">{v.totalDistance} km</td>
                            <td className="px-4 py-3">{v.totalTrips}</td>
                            <td className="px-4 py-3">{v.totalDrivingTime} h</td>
                            <td className="px-4 py-3">{v.averageSpeed} km/h</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loadingVehicles && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t">
                  <div className="text-xs text-muted-foreground text-center sm:text-left">
                    Showing {startIndex + 1}-{Math.min(endIndex, vehicles.length)} of {vehicles.length} vehicles
                  </div>
                  <div className="flex items-center justify-center sm:justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-7 w-7 p-0"
                    >
                      ‹
                    </Button>
                    <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                      {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-7 w-7 p-0"
                    >
                      ›
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>Comprehensive performance metrics - {period}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{overview?.averageSpeed || 0} km/h</div>
                    <div className="text-sm text-muted-foreground">Average Speed</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{overview?.tripsPerDay || 0}</div>
                    <div className="text-sm text-muted-foreground">Trips per Day</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{overview?.averageDistancePerDay || 0} km</div>
                    <div className="text-sm text-muted-foreground">Distance per Day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
  <Card>
    <CardHeader>
      <CardTitle>Vehicle Activity Heatmap</CardTitle>
      <CardDescription>Most visited places during {period}</CardDescription>
    </CardHeader>
    <CardContent>
      <VehiclePlacesHeatmap period={period} apiUrl={API_URL} />
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>
    </motion.div>
  )
}
