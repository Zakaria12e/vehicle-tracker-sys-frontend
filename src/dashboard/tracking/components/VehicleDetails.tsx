interface VehicleDetailsProps {
  name: string;
  plate: string;
  status: "moving" | "idle" | "offline";
  speed: string | number;
  location: string;
  lastUpdate: string;
}

export function VehicleDetails({ name, plate, status, speed, location, lastUpdate }: VehicleDetailsProps) {
  const statusColors = {
    moving: "green",
    idle: "amber",
    offline: "red",
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{plate}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full bg-${statusColors[status]}-500`} />
            <p className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Speed</p>
          <p className="font-medium">{typeof speed === "number" ? `${speed} km/h` : speed}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="font-medium">{location}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Last Update</p>
          <p className="font-medium">{lastUpdate}</p>
        </div>
      </div>
    </div>
  )
}
