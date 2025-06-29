import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { TrendingUp, Car, Clock, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import VehiclePlacesHeatmap from "./VehiclePlacesHeatmap"

export default function StatisticsTabs({
  activeTab,
  setActiveTab,
  overview,
  tripAnalytics,
  COLORS,
  loadingAnalytics,
  vehicles,
  currentVehicles,
  loadingVehicles,
  vehiclesPerPage,
  startIndex,
  endIndex,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  period,
  API_URL,
}) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <TabsContent value="overview" forceMount>
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="w-full h-[300px] sm:h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ChartContainer
                          config={{
                            distance: { label: "Distance (km)", color: COLORS[0] },
                            trips: { label: "Trips", color: COLORS[1] },
                          }}
                        >
                          <AreaChart data={tripAnalytics} margin={{ top: 10, right: 20, left: -15, bottom: 30 }}>
                            <XAxis
                              dataKey="period"
                              tickFormatter={(value) =>
                                period === "today" ? value.split(" ")[1] : value.split("-").slice(1).join("/")
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
        )}

        {activeTab === "vehicles" && (
          <TabsContent value="vehicles" forceMount>
            <motion.div
              key="vehicles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                          <th className="px-4 py-3 text-left">Avg Speed</th>
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
            </motion.div>
          </TabsContent>
        )}

        {activeTab === "analytics" && (
          <TabsContent value="analytics" forceMount>
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>Performance metrics - {period}</CardDescription>
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
                      <div className="text-2xl font-bold text-primary">
                        {overview?.averageDistancePerDay || 0} km
                      </div>
                      <div className="text-sm text-muted-foreground">Distance per Day</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        )}

        {activeTab === "heatmap" && (
          <TabsContent value="heatmap" forceMount>
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Activity Heatmap</CardTitle>
                  <CardDescription>Most visited places - {period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <VehiclePlacesHeatmap period={period} apiUrl={API_URL} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>
    </Tabs>
  )
}
