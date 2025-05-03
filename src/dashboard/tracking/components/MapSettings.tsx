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
          <Label htmlFor="show-traffic" className="text-sm">Show Traffic</Label>
          <Switch id="show-traffic" checked={showTraffic} onCheckedChange={onTrafficChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-geofences" className="text-sm">Show Geofences</Label>
          <Switch id="show-geofences" checked={showGeofences} onCheckedChange={onGeofencesChange} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="refresh-interval" className="text-sm">Refresh Interval</Label>
            <span className="text-xs text-muted-foreground">{refreshInterval}s</span>
          </div>
          <Slider
            id="refresh-interval"
            min={1}
            max={30}
            step={1}
            value={[refreshInterval]}
            onValueChange={(value) => onIntervalChange(value[0])}
          />
        </div>
      </div>
    </div>
  )
}
