"use client"

import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Bell, Mail, Smartphone, ArrowLeft, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface AlertRuleForm {
  name: string
  type: string
  threshold: string
  appliesToAllVehicles: boolean
  notifications: {
    email: boolean
    app: boolean
  }
}

const ALERT_TYPES = [
  {
    value: "SPEED_ALERT",
    label: "Speed Limit Exceeded",
    description: "Alert when vehicle exceeds speed limit",
    icon: "🚗",
  },
  {
    value: "BATTERY_ALERT",
    label: "Low Battery",
    description: "Alert when battery level is low",
    icon: "🔋",
  },
  {
    value: "GEOFENCE_EXIT",
    label: "Exited Geofence",
    description: "Alert when vehicle leaves designated area",
    icon: "📍",
  },
  {
    value: "GEOFENCE_ENTRY",
    label: "Entered Geofence",
    description: "Alert when vehicle enters designated area",
    icon: "🎯",
  },
]

export default function CreateAlertRulePage() {
  const [form, setForm] = useState<AlertRuleForm>({
    name: "",
    type: "SPEED_ALERT",
    threshold: "",
    appliesToAllVehicles: true,
    notifications: { email: false, app: true },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof AlertRuleForm, string>>>({})

  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof AlertRuleForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AlertRuleForm, string>> = {}

    if (!form.name.trim()) {
      newErrors.name = "Rule name is required"
    }

    if (showThreshold && !form.threshold) {
      newErrors.threshold = "Threshold is required"
    }

    if (showThreshold && form.threshold && Number(form.threshold) <= 0) {
      newErrors.threshold = "Threshold must be greater than 0"
    }

    if (!form.notifications.email && !form.notifications.app) {
      toast.error("Please select at least one notification method")
      return false
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await axios.post(
        `${API_URL}/alert-rules`,
        {
          name: form.name,
          type: form.type,
          threshold: form.type === "SPEED_ALERT" || form.type === "BATTERY_ALERT" ? Number(form.threshold) : undefined,
          appliesToAllVehicles: form.appliesToAllVehicles,
          vehicles: [],
          notifications: form.notifications,
        },
        {
          withCredentials: true,
        },
      )
      toast.success("Alert rule created successfully")
      navigate("/dashboard/alerts")
    } catch (error) {
      toast.error("Failed to create alert rule")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedAlertType = ALERT_TYPES.find((type) => type.value === form.type)
  const showThreshold = form.type === "SPEED_ALERT" || form.type === "BATTERY_ALERT"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/alerts")} className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Alerts
          </Button>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Alert Rule</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Set up automated alerts to monitor your vehicles and stay informed about important events.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Configure the basic settings for your alert rule.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter a descriptive name for your rule"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Alert Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(val) => setForm((f) => ({ ...f, type: val, threshold: "" }))}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERT_TYPES.map((alertType) => (
                        <SelectItem key={alertType.value} value={alertType.value}>
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-lg">{alertType.icon}</span>
                            <div className="text-left">
                              <div className="font-medium">{alertType.label}</div>
                              <div className="text-xs text-muted-foreground">{alertType.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

              
                </div>

                {showThreshold && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="threshold">Threshold</Label>
                      <Badge variant="secondary" className="text-xs">
                        {form.type === "SPEED_ALERT" ? "km/h" : "%"}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Input
                        id="threshold"
                        name="threshold"
                        type="number"
                        value={form.threshold}
                        onChange={handleChange}
                        placeholder={form.type === "SPEED_ALERT" ? "e.g. 90" : "e.g. 20"}
                        className={errors.threshold ? "border-destructive pr-16" : "pr-16"}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                        {form.type === "SPEED_ALERT" ? "km/h" : "%"}
                      </div>
                    </div>
                    {errors.threshold && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.threshold}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {form.type === "SPEED_ALERT"
                        ? "Alert will trigger when vehicle speed exceeds this value"
                        : "Alert will trigger when battery level falls below this percentage"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Choose how you want to be notified when this alert is triggered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Notification Methods</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                          form.notifications.email ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id="email"
                          checked={form.notifications.email}
                          onCheckedChange={(c) =>
                            setForm((f) => ({ ...f, notifications: { ...f.notifications, email: !!c } }))
                          }
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <Label htmlFor="email" className="cursor-pointer font-medium">
                              Email Notifications
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Receive alerts via email</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                          form.notifications.app ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id="app"
                          checked={form.notifications.app}
                          onCheckedChange={(c) =>
                            setForm((f) => ({ ...f, notifications: { ...f.notifications, app: !!c } }))
                          }
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <Label htmlFor="app" className="cursor-pointer font-medium">
                              In-App Notifications
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Receive alerts in the app</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

            
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Rule Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Rule Name</Label>
                    <p className="font-medium">{form.name || "Untitled Rule"}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Alert Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span>{selectedAlertType?.icon}</span>
                      <p className="font-medium">{selectedAlertType?.label}</p>
                    </div>
                  </div>

                  {showThreshold && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Threshold</Label>
                      <p className="font-medium">
                        {form.threshold || "Not set"} {form.type === "SPEED_ALERT" ? "km/h" : "%"}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-muted-foreground">Notifications</Label>
                    <div className="flex gap-1 mt-1">
                      {form.notifications.email && (
                        <Badge variant="secondary" className="text-xs">
                          Email
                        </Badge>
                      )}
                      {form.notifications.app && (
                        <Badge variant="secondary" className="text-xs">
                          In-App
                        </Badge>
                      )}
                      {!form.notifications.email && !form.notifications.app && (
                        <p className="text-sm text-muted-foreground">None selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Coverage</Label>
                    <p className="font-medium">{form.appliesToAllVehicles ? "All vehicles" : "Selected vehicles"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button onClick={handleSubmit} disabled={isLoading} className="w-full" size="lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Creating Rule..." : "Create Alert Rule"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/alerts")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
