import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, AlertTriangle, Clock, Battery, MapPin, ArrowUpRight, ShieldAlert } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
export default function DashboardPage() {
   const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>
       
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 speed alerts, 0 geofence</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 km</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <MapPin className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 idle, 0 in motion</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl">Vehicle Locations</CardTitle>
            <CardDescription>Current position of all your vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Recent Alerts</CardTitle>
            <CardDescription>Latest notifications from your vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/50">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Geofence Exit Alert</p>
                  <p className="text-xs text-muted-foreground">Vehicle XYZ-123 left designated zone</p>
                  <p className="text-xs text-muted-foreground">Today, 10:42 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/50">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Speed Alert</p>
                  <p className="text-xs text-muted-foreground">Vehicle ABC-789 exceeded speed limit (92 km/h)</p>
                  <p className="text-xs text-muted-foreground">Today, 9:15 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/50">
                    <Battery className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Low Battery</p>
                  <p className="text-xs text-muted-foreground">Vehicle DEF-456 tracker battery at 15%</p>
                  <p className="text-xs text-muted-foreground">Yesterday, 6:30 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Vehicles</CardTitle>
          <CardDescription>Manage and monitor your vehicle fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="idle">Idle</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Honda Civic</CardTitle>
                      <div className="flex h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <CardDescription>DEF-456 • Last updated 2h ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Unknown</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>0 km/h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span>100%</span>
                      </div>
                     
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                      <a href="/dashboard/tracking">
                        <ArrowUpRight className="h-3 w-3" />
                        View Details
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
