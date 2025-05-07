import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Unlock } from "lucide-react"

export const ActiveImmobilizations = () => {
  const immobilizedVehicles = [
    {
      vehicle: "Ford Transit",
      licensePlate: "ABC-789",
      immobilizedSince: "Apr 29, 2023 14:30",
      reason: "Unauthorized use",
      status: "Immobilized"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Immobilized Vehicles</CardTitle>
        <CardDescription>Vehicles that are currently immobilized</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {immobilizedVehicles.map((vehicle, index) => (
            <div key={index} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{vehicle.vehicle}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                </div>
                <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs text-red-800 dark:text-red-400 h-fit">
                  {vehicle.status}
                </span>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Since:</span>
                  <span>{vehicle.immobilizedSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span>{vehicle.reason}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="gap-1 w-full">
                <Unlock className="h-3 w-3" />
                Release
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                  <th className="px-4 py-3 text-left font-medium">License Plate</th>
                  <th className="px-4 py-3 text-left font-medium">Immobilized Since</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {immobilizedVehicles.map((vehicle, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{vehicle.vehicle}</td>
                    <td className="px-4 py-3">{vehicle.licensePlate}</td>
                    <td className="px-4 py-3">{vehicle.immobilizedSince}</td>
                    <td className="px-4 py-3">{vehicle.reason}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs text-red-800 dark:text-red-400">
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Unlock className="h-3 w-3" />
                        Release
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}