import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Car, MapPin, Gauge, Battery, LogOut, LogIn, Eye, ChevronLeft, ChevronRight } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

interface AlertData {
  vehicleId: string
  vehicleName?: string
  vehicleLicensePlate?: string
  type: string
  message: string
  location?: string
  timestamp: string
  data?: any
  user?: {
    _id: string
    name?: string
  }
  resolved?: boolean
}

const getAlertConfig = (type: string) => {
  switch (type) {
    case 'SPEED_ALERT':
      return {
        icon: Gauge,
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        borderColor: 'border-red-200 dark:border-red-800/50',
        iconBg: 'bg-red-100 dark:bg-red-900/50',
        iconColor: 'text-red-600 dark:text-red-400',
        label: 'Speed Alert'
      }
    case 'BATTERY_ALERT':
      return {
        icon: Battery,
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        borderColor: 'border-orange-200 dark:border-orange-800/50',
        iconBg: 'bg-orange-100 dark:bg-orange-900/50',
        iconColor: 'text-orange-600 dark:text-orange-400',
        label: 'Battery Alert'
      }
    case 'GEOFENCE_EXIT':
      return {
        icon: LogOut,
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-200 dark:border-purple-800/50',
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        iconColor: 'text-purple-600 dark:text-purple-400',
        label: 'Geofence Exit'
      }
    case 'GEOFENCE_ENTRY':
      return {
        icon: LogIn,
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-200 dark:border-blue-800/50',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
        label: 'Geofence Entry'
      }
    default:
      return {
        icon: AlertTriangle,
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        borderColor: 'border-amber-200 dark:border-amber-800/50',
        iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        iconColor: 'text-amber-600 dark:text-amber-400',
        label: type.replace(/_/g, " ")
      }
  }
}

export function CurrentAlerts() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const alertsPerPage = 3

  useEffect(() => {
    const fetchInitialAlerts = async () => {
      try {
        const res = await fetch(`${API_URL}/alerts/active`, {
          credentials: 'include',
        });
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error('Failed to load initial alerts', err);
      }
    };
    fetchInitialAlerts()
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
    <Card className="w-full">
      <CardHeader className=" px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg">Active Alerts</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''} requiring attention
            </CardDescription>
          </div>
          {alerts.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full self-start sm:self-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                {alerts.length}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6">
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Car className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">All clear! No active alerts.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentAlerts.map((alert, index) => {
              const config = getAlertConfig(alert.type)
              const IconComponent = config.icon
              
              return (
                <div
                  key={startIndex + index}
                  className={`rounded-lg border ${config.bgColor} ${config.borderColor} p-2.5 sm:p-3 transition-all duration-200 hover:shadow-sm`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`rounded-full p-1 sm:p-1.5 ${config.iconBg} flex-shrink-0`}>
                      <IconComponent className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${config.iconColor}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-xs sm:text-sm leading-tight pr-1">{config.label}</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0 text-right">
                          {new Date(alert.timestamp).toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <Car className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {alert.vehicleName || "Unknown"} 
                            {alert.vehicleLicensePlate && (
                              <span className="ml-1 font-mono">({alert.vehicleLicensePlate})</span>
                            )}
                          </span>
                        </div>
                        
                        {alert.location && (
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{alert.location}</span>
                          </div>
                        )}
                      </div>
                      
                    
                    </div>
                  </div>
                </div>
              )
            })}
            
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
                    <ChevronLeft className="h-3.5 w-3.5" />
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
        )}
      </CardContent>
    </Card>
  )
}