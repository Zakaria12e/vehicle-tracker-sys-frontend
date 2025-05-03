import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const ImmobilizationHistory = () => {
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
        <div className="relative overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">License Plate</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Immobilized</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Released</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Duration</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Reason</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="whitespace-nowrap px-4 py-3">Toyota Corolla</td>
                <td className="whitespace-nowrap px-4 py-3">XYZ-123</td>
                <td className="whitespace-nowrap px-4 py-3">Apr 25, 2023 10:30</td>
                <td className="whitespace-nowrap px-4 py-3">Apr 25, 2023 15:45</td>
                <td className="whitespace-nowrap px-4 py-3">5h 15m</td>
                <td className="whitespace-nowrap px-4 py-3">Theft prevention</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-400">
                    Released
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
