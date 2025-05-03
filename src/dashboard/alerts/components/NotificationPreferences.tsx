import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Battery, Bell, Clock, Fuel, Mail, MessageSquare, ShieldAlert } from "lucide-react"

export function NotificationPreferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you receive alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Methods</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Email Notifications */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Email Notifications</span>
                </div>
                <Switch defaultChecked />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Receive alerts via email</p>
              <div className="mt-4">
                <Label htmlFor="email-address">Email Address</Label>
                <Input id="email-address" className="mt-1" defaultValue="john.doe@example.com" />
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">SMS Notifications</span>
                </div>
                <Switch />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Receive alerts via SMS</p>
              <div className="mt-4">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input id="phone-number" className="mt-1" placeholder="+1 (555) 123-4567" />
              </div>
            </div>

            {/* In-app Notifications */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">In-app Notifications</span>
                </div>
                <Switch defaultChecked />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Receive alerts in the application</p>
              <div className="mt-4">
                <Label htmlFor="notification-sound">Notification Sound</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="notification-sound" className="mt-1">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alert Types</h3>
          <div className="space-y-2">
            {/* Alert type switches */}
            <div className="space-y-2">
              {[
                { icon: AlertTriangle, color: "amber", label: "Speed Alerts" },
                { icon: ShieldAlert, color: "red", label: "Geofence Alerts" },
                { icon: Battery, color: "blue", label: "Battery Alerts" },
                { icon: Clock, color: "purple", label: "Idle Time Alerts" },
                { icon: Fuel, color: "green", label: "Fuel Level Alerts" },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 text-${color}-500`} />
                    <span>{label}</span>
                  </div>
                  <Switch defaultChecked={label !== "Fuel Level Alerts"} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}
