import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Car, MapPin, Trash2 } from "lucide-react"
export function CurrentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Alerts</CardTitle>
        <CardDescription>Active alerts that require attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/30 p-4">
          {/* Speed Alert */}
          <div className="flex items-start gap-4">
            <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/50">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Speed Alert</p>
                <p className="text-xs text-muted-foreground">Today, 9:15 AM</p>
              </div>
              <p className="text-sm">Vehicle ABC-789 exceeded speed limit (92 km/h)</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Car className="h-3 w-3" />
                <span>Ford Transit</span>
                <MapPin className="h-3 w-3 ml-2" />
                <span>Highway 101, North District</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">View on Map</Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-3 w-3 mr-1" />Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
