import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Battery, Clock, ShieldAlert, ChevronRight } from "lucide-react"

export function AlertHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <CardDescription>Past alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop view - Table */}
        <div className="hidden md:block relative overflow-x-auto rounded-md border">
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

        {/* Mobile view - Card list */}
        <div className="md:hidden space-y-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Speed Alert</span>
              </div>
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-1 text-xs text-amber-800 dark:text-amber-400">Active</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Ford Transit (ABC-789)</p>
              <p>Exceeded speed limit (92 km/h)</p>
              <p className="text-xs text-muted-foreground">Apr 30, 2023 9:15 AM</p>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                View <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}