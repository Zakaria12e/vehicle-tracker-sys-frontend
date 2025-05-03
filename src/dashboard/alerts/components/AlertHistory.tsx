import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Battery, Clock, ShieldAlert } from "lucide-react"

export function AlertHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <CardDescription>Past alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Alert Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Description</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Date & Time</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Speed Alert</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">Ford Transit (ABC-789)</td>
                <td className="whitespace-nowrap px-4 py-3">Exceeded speed limit (92 km/h)</td>
                <td className="whitespace-nowrap px-4 py-3">Apr 30, 2023 9:15 AM</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-1 text-xs text-amber-800 dark:text-amber-400">Active</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
