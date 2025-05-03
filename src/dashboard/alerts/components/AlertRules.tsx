import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function AlertRules() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Rules</CardTitle>
        <CardDescription>Manage your configured alert rules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Alert Rule Item */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">Speed Limit Alert</div>
              <div className="text-sm text-muted-foreground">Alert when vehicles exceed 90 km/h</div>
              <div className="text-xs text-muted-foreground">Applied to: All Vehicles</div>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
          {/* Add more rules as needed */}
        </div>
      </CardContent>
    </Card>
  )
}
