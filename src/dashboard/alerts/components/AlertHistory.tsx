import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Battery, Gauge, Target, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const API_URL = import.meta.env.VITE_API_URL

interface AlertData {
  _id: string
  type: string
  vehicleName?: string
  vehicleLicensePlate?: string
  message: string
  timestamp: string
  status?: string
}

const getAlertConfig = (type: string) => {
  switch (type) {
    case 'SPEED_ALERT':
      return { icon: Gauge, label: 'Speed Alert', color: 'amber' }
    case 'BATTERY_ALERT':
      return { icon: Battery, label: 'Battery Alert', color: 'orange' }
    case 'GEOFENCE_EXIT':
      return { icon: Target, label: 'Geofence Exit', color: 'red' }
    case 'GEOFENCE_ENTRY':
      return { icon: Target, label: 'Geofence Entry', color: 'green' }
    default:
      return { icon: AlertTriangle, label: type.replace(/_/g, ' '), color: 'gray' }
  }
}

export function AlertHistory() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const alertsPerPage = 5

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/alerts/history`, {
          credentials: 'include',
        })
        const data = await res.json()
        setAlerts(data)
      } catch (err) {
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const totalPages = Math.ceil(alerts.length / alertsPerPage)
  const startIndex = (currentPage - 1) * alertsPerPage
  const endIndex = startIndex + alertsPerPage
  const currentAlerts = alerts.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

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
              {loading ? (
                Array.from({ length: alertsPerPage }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-8 w-12" /></td>
                  </tr>
                ))
              ) : currentAlerts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No alert history found.</td></tr>
              ) : (
                currentAlerts.map(alert => {
                  const config = getAlertConfig(alert.type)
                  const Icon = config.icon
                  return (
                    <tr className="border-b" key={alert._id}>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className={`flex items-center gap-2`}>
                          <Icon className={`h-4 w-4 text-${config.color}-500`} />
                          <span>{config.label}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{alert.vehicleName} {alert.vehicleLicensePlate && <span className="font-mono">({alert.vehicleLicensePlate})</span>}</td>
                      <td className="whitespace-nowrap px-4 py-3">{alert.message}</td>
                      <td className="whitespace-nowrap px-4 py-3">{new Date(alert.timestamp).toLocaleString()}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-400">Resolved</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t">
              <div className="text-xs text-muted-foreground text-center sm:text-left">
                Showing {startIndex + 1}-{Math.min(endIndex, alerts.length)} of {alerts.length} alerts
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                </Button>
                <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile view - Card list */}
        <div className="md:hidden space-y-3">
          {currentAlerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No alert history found.</div>
          ) : (
            currentAlerts.map(alert => {
              const config = getAlertConfig(alert.type)
              const Icon = config.icon
              return (
                <div className="rounded-lg border p-4" key={alert._id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 text-${config.color}-500`} />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <span className="rounded-full bg-gray-100 dark:bg-gray-900/30 px-2 py-1 text-xs text-gray-800 dark:text-gray-400">Resolved</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">{alert.vehicleName} {alert.vehicleLicensePlate && <span className="font-mono">({alert.vehicleLicensePlate})</span>}</p>
                    <p>{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      View <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t">
              <div className="text-xs text-muted-foreground text-center sm:text-left">
                Showing {startIndex + 1}-{Math.min(endIndex, alerts.length)} of {alerts.length} alerts
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                </Button>
                <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}