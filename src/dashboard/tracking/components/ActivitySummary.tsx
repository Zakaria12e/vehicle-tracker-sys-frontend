interface ActivitySummaryProps {
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  drivingTime: string;
}

export function ActivitySummary({ distance, avgSpeed, maxSpeed, drivingTime }: ActivitySummaryProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Today's Activity</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span>Distance traveled</span>
          <span className="font-medium">{distance} km</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Average speed</span>
          <span className="font-medium">{avgSpeed} km/h</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Max speed</span>
          <span className="font-medium">{maxSpeed} km/h</span>
        </div>
        <div className="flex justify-between">
          <span>Driving time</span>
          <span className="font-medium">{drivingTime}</span>
        </div>
      </div>
    </div>
  )
}
