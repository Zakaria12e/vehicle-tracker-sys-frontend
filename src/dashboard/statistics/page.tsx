"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Car, Clock, MapPin } from "lucide-react";

type Period = "today" | "thisWeek" | "thisMonth" | "thisYear";

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("thisMonth");
  const [overview, setOverview] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const overviewRes = await fetch(`${API_URL}/statistics/overview?period=${period}`, { credentials: "include" });
        const overviewJson = await overviewRes.json();
        setOverview(overviewJson.data);

        const vehicleRes = await fetch(`${API_URL}/statistics/vehicles?period=${period}`, { credentials: "include" });
        const vehicleJson = await vehicleRes.json();
        setVehicles(vehicleJson.data);
        setCurrentPage(1); // Reset pagination when period changes
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const currentVehicles = vehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  if (loading || !overview) return <p className="p-4">Loading statistics...</p>;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalDistance} km</div>
            <p className="text-xs text-muted-foreground">{overview.daysOfOperation} active days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalTrips} trips</div>
            <p className="text-xs text-muted-foreground">{overview.activeVehicles} active vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Driving Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalDrivingTime}h</div>
            <p className="text-xs text-muted-foreground">Utilization: {overview.utilization}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">By Vehicle</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <p className="text-sm text-muted-foreground">More overview charts coming soon...</p>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
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
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Distance</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Trips</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Driving Time</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Avg. Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVehicles.map((v, i) => (
                      <tr key={i} className="border-b">
                        <td className="whitespace-nowrap px-4 py-3 font-medium">{v.vehicleName}</td>
                        <td className="whitespace-nowrap px-4 py-3">{v.totalDistance} km</td>
                        <td className="whitespace-nowrap px-4 py-3">{v.totalTrips}</td>
                        <td className="whitespace-nowrap px-4 py-3">{v.totalDrivingTime} h</td>
                        <td className="whitespace-nowrap px-4 py-3">{v.averageSpeed} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
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
    </div>
  );
}
