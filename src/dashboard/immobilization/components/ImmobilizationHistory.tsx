import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const ImmobilizationHistory = () => {
  const historyItems = [
    {
      vehicle: "Toyota Corolla",
      licensePlate: "XYZ-123",
      immobilized: "Apr 25, 2023 10:30",
      released: "Apr 25, 2023 15:45",
      duration: "5h 15m",
      reason: "Theft prevention",
      status: "Released"
    }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Immobilization History</CardTitle>
          <CardDescription>Past vehicle immobilizations</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search history..." className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {historyItems.map((item, index) => (
            <div key={index} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.vehicle}</h3>
                  <p className="text-sm text-muted-foreground">{item.licensePlate}</p>
                </div>
                <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-400 h-fit">
                  {item.status}
                </span>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Immobilized:</span>
                  <span>{item.immobilized}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Released:</span>
                  <span>{item.released}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span>{item.reason}</span>
                </div>
              </div>
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
                  <th className="px-4 py-3 text-left font-medium">Immobilized</th>
                  <th className="px-4 py-3 text-left font-medium">Released</th>
                  <th className="px-4 py-3 text-left font-medium">Duration</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{item.vehicle}</td>
                    <td className="px-4 py-3">{item.licensePlate}</td>
                    <td className="px-4 py-3">{item.immobilized}</td>
                    <td className="px-4 py-3">{item.released}</td>
                    <td className="px-4 py-3">{item.duration}</td>
                    <td className="px-4 py-3">{item.reason}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-400">
                        {item.status}
                      </span>
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