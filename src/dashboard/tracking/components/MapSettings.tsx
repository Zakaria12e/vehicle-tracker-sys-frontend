import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface MapSettingsProps {
  showTraffic: boolean;
  showGeofences: boolean;
  refreshInterval: number;
  onTrafficChange: (value: boolean) => void;
  onGeofencesChange: (value: boolean) => void;
  onIntervalChange: (value: number) => void;
}

export function MapSettings({
  showTraffic,
  showGeofences,
  refreshInterval,
  onTrafficChange,
  onGeofencesChange,
  onIntervalChange,
}: MapSettingsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Map Settings</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-geofences" className="text-sm">Show Geofences</Label>
          <Switch id="show-geofences" checked={showGeofences} onCheckedChange={onGeofencesChange} />
        </div>
     
      </div>
    </div>
  )
}
