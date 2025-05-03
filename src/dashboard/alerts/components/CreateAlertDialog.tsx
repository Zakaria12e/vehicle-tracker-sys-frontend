"use client"

import { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  app: boolean;
}

interface AlertFormData {
  name: string;
  type: string;
  threshold: string;
  vehicles: string | string[];
  notifications: NotificationSettings;
}

export function CreateAlertDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<AlertFormData>({
    name: "",
    type: "",
    threshold: "",
    vehicles: [],
    notifications: {
      email: false,
      sms: false,
      app: true,
    },
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (field: keyof NotificationSettings, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }))
  }

  const handleSubmit = () => {
    setIsOpen(false)
    setFormData({
      name: "",
      type: "",
      threshold: "",
      vehicles: [],
      notifications: {
        email: false,
        sms: false,
        app: true,
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
          <DialogDescription>Set up a new alert for your vehicles</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alert-name">Alert Name</Label>
            <Input
              id="alert-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Speed Limit Alert"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-type">Alert Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="speed">Speed Limit</SelectItem>
                <SelectItem value="geofence">Geofence</SelectItem>
                <SelectItem value="battery">Low Battery</SelectItem>
                <SelectItem value="idle">Idle Time</SelectItem>
                <SelectItem value="movement">Unauthorized Movement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-threshold">Threshold</Label>
            <div className="flex items-center gap-2">
              <Input
                id="alert-threshold"
                name="threshold"
                value={formData.threshold}
                onChange={handleChange}
                type="number"
                placeholder="90"
              />
              <span>km/h</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Apply to Vehicles</Label>
            <Select
              value={Array.isArray(formData.vehicles) ? formData.vehicles.join(", ") : formData.vehicles || ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicles: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="toyota">Toyota Corolla</SelectItem>
                <SelectItem value="ford">Ford Transit</SelectItem>
                <SelectItem value="honda">Honda Civic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notification Methods</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="email"
                checked={formData.notifications.email}
                onCheckedChange={(checked) => handleCheckboxChange("email", !!checked)}
              />
              <Label htmlFor="email" className="text-sm font-normal">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms"
                checked={formData.notifications.sms}
                onCheckedChange={(checked) => handleCheckboxChange("sms", !!checked)}
              />
              <Label htmlFor="sms" className="text-sm font-normal">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="app"
                checked={formData.notifications.app}
                onCheckedChange={(checked) => handleCheckboxChange("app", !!checked)}
              />
              <Label htmlFor="app" className="text-sm font-normal">In-app notification</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Create Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
