"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Download,
  Car,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import VehiclePlacesHeatmap from "./components/VehiclePlacesHeatmap";
import { VehiclePerformanceBarChart } from "./components/VehiclePerformanceBarChart";

type Period = "today" | "thisWeek" | "thisMonth" | "thisYear";

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("thisMonth");
  const [overview, setOverview] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [tripAnalytics, setTripAnalytics] = useState<any[]>([]);
  const [fleetStatus, setFleetStatus] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingFleetStatus, setLoadingFleetStatus] = useState(false);
  const [COLORS, setCOLORS] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 20;

  const API_URL = import.meta.env.VITE_API_URL;

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
      setLoadingOverview(true);
      try {
        const res = await fetch(
          `${API_URL}/statistics/overview?period=${period}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setOverview(json.data);
      } catch (error) {
        console.error("Error fetching overview:", error);
      } finally {
        setLoadingOverview(false);
      }
    };

    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const res = await fetch(
          `${API_URL}/statistics/vehicles?period=${period}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setVehicles(json.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    const fetchTripAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const groupBy = period === "today" ? "hour" : "day";
        const res = await fetch(
          `${API_URL}/statistics/trip-analytics?period=${period}&groupBy=${groupBy}`,
          {
            credentials: "include",
          }
        );
        const json = await res.json();
        setTripAnalytics(json.data);
      } catch (error) {
        console.error("Error fetching trip analytics:", error);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchOverview();
    fetchVehicles();
    fetchTripAnalytics();
  }, [period]);

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;

  // Sort vehicles by totalDistance (biggest first)
  const sortedVehicles = [...vehicles].sort(
    (a, b) => b.totalDistance - a.totalDistance
  );
  const currentVehicles = sortedVehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Prepare fleet status data for pie chart
  const fleetStatusData = fleetStatus
    ? [
        {
          name: "Moving",
          value: fleetStatus.statusBreakdown.moving,
          color: COLORS[1],
        },
        {
          name: "Stopped",
          value: fleetStatus.statusBreakdown.stopped,
          color: COLORS[2],
        },
        {
          name: "Inactive",
          value: fleetStatus.statusBreakdown.inactive,
          color: COLORS[5],
        },
        {
          name: "Immobilized",
          value: fleetStatus.statusBreakdown.immobilized,
          color: COLORS[4],
        },
      ].filter((item) => item.value > 0)
    : [];

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
          <p className="text-muted-foreground pb-2">
            Analyze your fleet performance
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 bg-background/50 backdrop-blur-sm"
          >
            <Download className="h-4 w-4" />
            <span className="">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Distance",
            icon: MapPin,
            value: overview?.totalDistance,
            unit: "km",
          },
          {
            title: "Total Trips",
            icon: Car,
            value: overview?.totalTrips,
            unit: "trips",
          },
          {
            title: "Driving Time",
            icon: Clock,
            value: overview?.totalDrivingTime,
            unit: "h",
          },
          {
            title: "Active Vehicles",
            icon: Activity,
            value: overview?.activeVehicles,
            unit: "vehicles",
          },
        ].map((item, index) => (
          <Card key={index} className="p-3">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
              <CardTitle className="text-[13px] sm:text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl sm:text-2xl font-bold">
                {loadingOverview || loadingFleetStatus ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  `${item.value || 0} ${item.unit}`
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                {item.title === "Total Distance" &&
                  `${overview?.daysOfOperation || 0} active days`}
                {item.title === "Total Trips" &&
                  `${overview?.activeVehicles || 0} active vehicles`}
                {item.title === "Driving Time" &&
                  `Utilization: ${overview?.utilization || 0}%`}
                {item.title === "Active Vehicles" &&
                  `${overview?.utilization || 0}% utilization`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="">
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

        <TabsContent value="overview" className="p-0 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trip Analytics
                </CardTitle>
                <CardDescription>
                  Distance and trips over time - {period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAnalytics ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px] overflow-x-auto sm:overflow-visible">
                    <ResponsiveContainer width="100%" height="100%">
                      <ChartContainer
                        config={{
                          distance: {
                            label: "Distance (km)",
                            color: COLORS[0],
                          },
                          trips: { label: "Trips", color: COLORS[1] },
                        }}
                      >
                        <AreaChart
                          data={tripAnalytics}
                          margin={{ top: 10, right: 20, left: -15, bottom: 30 }}
                        >
                          <XAxis
                            dataKey="period"
                            tickFormatter={(value) =>
                              period === "today"
                                ? value.split(" ")[1]
                                : value.split("-").slice(1).join("/")
                            }
                            fontSize={window.innerWidth < 768 ? 10 : 12}
                            interval={window.innerWidth < 768 ? 1 : 0}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VehiclePerformanceBarChart
              vehicles={vehicles}
              COLORS={COLORS}
              loading={loadingVehicles}
              period={period}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Comprehensive performance metrics - {period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {overview?.averageSpeed || 0} km/h
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Speed
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {overview?.tripsPerDay || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Trips per Day
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {overview?.averageDistancePerDay || 0} km
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Distance per Day
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="heatmap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Activity Heatmap</CardTitle>
                <CardDescription>
                  Most visited places during {period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehiclePlacesHeatmap period={period} apiUrl={API_URL} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
