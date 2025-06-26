"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Car, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type Period = "today" | "thisWeek" | "thisMonth" | "thisYear";

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("thisMonth");
  const [overview, setOverview] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOverview = async () => {
      setLoadingOverview(true);
      try {
        const res = await fetch(`${API_URL}/statistics/overview?period=${period}`, { credentials: "include" });
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
        const res = await fetch(`${API_URL}/statistics/vehicles?period=${period}`, { credentials: "include" });
        const json = await res.json();
        setVehicles(json.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchOverview();
    fetchVehicles();
  }, [period]);

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;

  // Sort vehicles by totalDistance (biggest first)
  const sortedVehicles = [...vehicles].sort((a, b) => b.totalDistance - a.totalDistance);
  const currentVehicles = sortedVehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

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
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Total Distance", icon: MapPin, value: overview?.totalDistance, unit: "km" },
          { title: "Total Trips", icon: Car, value: overview?.totalTrips, unit: "trips" },
          { title: "Driving Time", icon: Clock, value: overview?.totalDrivingTime, unit: "h" },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {item.value} {item.unit}
              </div>
              <p className="text-xs text-muted-foreground">
                {item.title === "Total Distance" && `${overview?.daysOfOperation} active days`}
                {item.title === "Total Trips" && `${overview?.activeVehicles} active vehicles`}
                {item.title === "Driving Time" && `Utilization: ${overview?.utilization}%`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">By Vehicle</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <p className="text-sm text-muted-foreground">More overview charts coming soon...</p>
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
      </Tabs>
    </motion.div>
  );
}
