import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Lock, AlertTriangle, Locate } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/20">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
)

export default function TrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [showTraffic, setShowTraffic] = useState(false)
  const [showGeofences, setShowGeofences] = useState(true)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-xl font-bold">Live Tracking</h1>
          <p className="text-sm text-muted-foreground">Monitor your vehicles in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all" value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="toyota">Toyota Corolla</SelectItem>
              <SelectItem value="ford">Ford Transit</SelectItem>
              <SelectItem value="honda">Honda Civic</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Locate className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid flex-1 md:grid-cols-[1fr_300px]">
        <div className="relative">
          <Suspense fallback={<MapLoading />}>
          
          </Suspense>
        </div>

        <div className="border-l overflow-auto">
          <Tabs defaultValue="vehicles">
            <TabsList className="w-full">
              <TabsTrigger value="vehicles" className="flex-1">
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="vehicles" className="p-4 space-y-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Toyota Corolla</CardTitle>
                    <div className="flex h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <CardDescription>XYZ-123 • Moving</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span>Downtown</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>65 km/h</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Immobilize
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Ford Transit</CardTitle>
                    <div className="flex h-2 w-2 rounded-full bg-amber-500" />
                  </div>
                  <CardDescription>ABC-789 • Idle</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span>North District</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>0 km/h</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Immobilize
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Honda Civic</CardTitle>
                    <div className="flex h-2 w-2 rounded-full bg-red-500" />
                  </div>
                  <CardDescription>DEF-456 • Offline</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span>Unknown</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>--</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" disabled>
                      <Lock className="h-3 w-3" />
                      Immobilize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Toyota Corolla</h3>
                  <p className="text-sm text-muted-foreground">XYZ-123</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="font-medium">Moving</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Speed</p>
                    <p className="font-medium">65 km/h</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">Downtown</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Update</p>
                    <p className="font-medium">2 minutes ago</p>
                  </div>
                 
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Map Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-traffic" className="text-sm">
                        Show Traffic
                      </Label>
                      <Switch id="show-traffic" checked={showTraffic} onCheckedChange={setShowTraffic} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-geofences" className="text-sm">
                        Show Geofences
                      </Label>
                      <Switch id="show-geofences" checked={showGeofences} onCheckedChange={setShowGeofences} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="refresh-interval" className="text-sm">
                          Refresh Interval
                        </Label>
                        <span className="text-xs text-muted-foreground">{refreshInterval}s</span>
                      </div>
                      <Slider
                        id="refresh-interval"
                        min={1}
                        max={30}
                        step={1}
                        value={[refreshInterval]}
                        onValueChange={(value: number[]) => setRefreshInterval(value[0])}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Vehicle Controls</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1 flex-1">
                      <Lock className="h-3 w-3" />
                      Immobilize
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 flex-1">
                      <AlertTriangle className="h-3 w-3" />
                      Alert Driver
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Today's Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span>Distance traveled</span>
                      <span className="font-medium">78 km</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Average speed</span>
                      <span className="font-medium">42 km/h</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Max speed</span>
                      <span className="font-medium">92 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driving time</span>
                      <span className="font-medium">1h 45m</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
