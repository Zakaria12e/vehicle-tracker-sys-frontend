import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Unlock } from "lucide-react"

export const ActiveImmobilizations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Immobilized Vehicles</CardTitle>
        <CardDescription>Vehicles that are currently immobilized</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">License Plate</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Immobilized Since</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Reason</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="whitespace-nowrap px-4 py-3">Ford Transit</td>
                <td className="whitespace-nowrap px-4 py-3">ABC-789</td>
                <td className="whitespace-nowrap px-4 py-3">Apr 29, 2023 14:30</td>
                <td className="whitespace-nowrap px-4 py-3">Unauthorized use</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs text-red-800 dark:text-red-400">
                    Immobilized
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Unlock className="h-3 w-3" />
                    Release
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
