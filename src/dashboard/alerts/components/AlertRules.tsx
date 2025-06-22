import type React from "react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Settings,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Battery,
  MapPin,
  Target,
  Bell,
  Mail,
  Smartphone,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"

interface AlertRule {
  _id: string
  name: string
  type: string
  threshold?: number
  enabled: boolean
  notifications: {
    email: boolean
    app: boolean
  }
}

const API_URL = import.meta.env.VITE_API_URL

// Map alert types to icons and colors
const ALERT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  SPEED_ALERT: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Speed Alert",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  BATTERY_ALERT: {
    icon: <Battery className="h-4 w-4" />,
    label: "Battery Alert",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  GEOFENCE_EXIT: {
    icon: <Target className="h-4 w-4" />,
    label: "Geofence Exit",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  GEOFENCE_ENTRY: {
    icon: <Target className="h-4 w-4" />,
    label: "Geofence Entry",
    color: "bg-green-100 text-green-700 border-green-200",
  },
}

export function AlertRules() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [expandedRule, setExpandedRule] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()
  const rulesPerPage = 3

  const totalPages = Math.ceil(rules.length / rulesPerPage)
  const startIndex = (currentPage - 1) * rulesPerPage
  const endIndex = startIndex + rulesPerPage
  const currentRules = rules.slice(startIndex, endIndex)

  const fetchRules = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/alert-rules`, { withCredentials: true })
      setRules(res.data as AlertRule[])
    } catch (err) {
      toast.error("Failed to load alert rules")
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedRule(expandedRule === id ? null : id)
  }

  const toggleRule = async (ruleId: string) => {
    setActionInProgress(ruleId)
    try {
      const res = await axios.patch<{ enabled: boolean }>(
        `${API_URL}/alert-rules/${ruleId}/toggle`,
        {},
        { withCredentials: true },
      )
      setRules((prev) => prev.map((r) => (r._id === ruleId ? { ...r, enabled: res.data.enabled } : r)))
      toast.success(`Rule ${res.data.enabled ? "enabled" : "disabled"}`)
    } catch {
      toast.error("Failed to toggle rule")
    } finally {
      setActionInProgress(null)
    }
  }

  const confirmDelete = (ruleId: string) => {
    setRuleToDelete(ruleId)
    setDeleteDialogOpen(true)
  }

  const deleteRule = async () => {
    if (!ruleToDelete) return

    setActionInProgress(ruleToDelete)
    try {
      await axios.delete(`${API_URL}/alert-rules/${ruleToDelete}`, { withCredentials: true })
      setRules((prev) => prev.filter((r) => r._id !== ruleToDelete))
      toast.success("Rule deleted successfully")
    } catch {
      toast.error("Failed to delete rule")
    } finally {
      setActionInProgress(null)
      setDeleteDialogOpen(false)
      setRuleToDelete(null)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const getTypeConfig = (type: string) => {
    return (
      ALERT_TYPE_CONFIG[type] || {
        icon: <Bell className="h-4 w-4" />,
        label: type,
        color: "bg-gray-100 text-gray-700 border-gray-200",
      }
    )
  }

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

  const renderRuleCard = (rule: AlertRule) => {
    const typeConfig = getTypeConfig(rule.type)
    const isExpanded = expandedRule === rule._id
    const isActionInProgress = actionInProgress === rule._id

    return (
      <div key={rule._id} className={`rounded-lg border transition-all p-2 sm:p-3 ${rule.enabled ? "bg-card" : "bg-muted/30"}`}>
        <div className="space-y-2 sm:space-y-3">
          {/* Header with name and status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="font-medium text-sm sm:text-base flex-1 truncate">{rule.name}</div>
              <Badge variant="outline" className={`${typeConfig.color} whitespace-nowrap text-xs font-medium`}>
                <span className="flex items-center gap-1">
                  {typeConfig.icon}
                  <span className="hidden sm:inline">{typeConfig.label}</span>
                </span>
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule._id)}
                  disabled={isActionInProgress}
                />
                <span className="text-xs sm:text-sm text-muted-foreground">{rule.enabled ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          {/* Rule details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            {/* Type and threshold */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="flex items-center gap-1.5">
                {typeConfig.icon}
                <span className="text-xs sm:text-sm">{typeConfig.label}</span>
              </div>
            </div>

            {/* Threshold if applicable */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Threshold</div>
              <div>
                {rule.threshold !== undefined ? (
                  <span className="font-medium text-xs sm:text-sm">
                    {rule.threshold} {rule.type === "SPEED_ALERT" ? "km/h" : "%"}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">Not applicable</span>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Notifications</div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {rule.notifications.email && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3" />
                    <span>Email</span>
                  </Badge>
                )}
                {rule.notifications.app && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Smartphone className="h-3 w-3" />
                    <span>In-App</span>
                  </Badge>
                )}
                {!rule.notifications.email && !rule.notifications.app && (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t">
            {/* Mobile expand button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(rule._id)}
                className="text-muted-foreground w-full justify-between h-7 text-xs"
              >
                {isExpanded ? "Hide actions" : "Show actions"}
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/alerts/edit/${rule._id}`)}
                disabled={isActionInProgress}
                className="h-7 text-xs"
              >
                <Settings className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive h-7 text-xs"
                onClick={() => confirmDelete(rule._id)}
                disabled={isActionInProgress}
              >
                {isActionInProgress ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                )}
                Delete
              </Button>
            </div>

            {/* Mobile expanded actions */}
            {isExpanded && (
              <div className="grid grid-cols-2 gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-xs"
                  onClick={() => navigate(`/dashboard/alerts/edit/${rule._id}`)}
                  disabled={isActionInProgress}
                >
                  <Settings className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive h-7 text-xs"
                  onClick={() => confirmDelete(rule._id)}
                  disabled={isActionInProgress}
                >
                  {isActionInProgress ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="rounded-lg border p-2 sm:p-3 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 sm:h-5 w-[150px] sm:w-[200px]" />
            <Skeleton className="h-4 sm:h-5 w-[80px] sm:w-[100px]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="space-y-1">
              <Skeleton className="h-3 w-[60px] sm:w-[80px]" />
              <Skeleton className="h-4 w-[100px] sm:w-[120px]" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-[60px] sm:w-[80px]" />
              <Skeleton className="h-4 w-[80px] sm:w-[100px]" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-[60px] sm:w-[80px]" />
              <Skeleton className="h-4 w-[120px] sm:w-[150px]" />
            </div>
          </div>
          <div className="pt-2 border-t flex justify-end">
            <Skeleton className="h-7 w-[140px] sm:w-[180px]" />
          </div>
        </div>
      ))
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-xl">Alert Rules</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
            </CardDescription>
          </div>
          <Button asChild className="self-start sm:self-center h-7 sm:h-8 text-xs sm:text-sm">
            <Link to="/alerts/create" className="gap-1">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Create Alert Rule</span>
              <span className="sm:hidden">Create</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6">
        <div className="space-y-2">
          {loading ? (
            renderSkeletons()
          ) : currentRules.length === 0 ? (
            <div className="text-center py-6 sm:py-8 border rounded-lg bg-muted/30">
              <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base sm:text-lg font-medium mb-1">No alert rules found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Create your first alert rule to start monitoring your vehicles
              </p>
              <Button asChild className="h-7 sm:h-8 text-xs sm:text-sm">
                <Link to="/alerts/create" className="gap-1">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Create Alert Rule
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {currentRules.map(renderRuleCard)}
              
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t">
                  <div className="text-xs text-muted-foreground text-center sm:text-left">
                    Showing {startIndex + 1}-{Math.min(endIndex, rules.length)} of {rules.length} rules
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
            </>
          )}
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this alert rule. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionInProgress === ruleToDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteRule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionInProgress === ruleToDelete}
            >
              {actionInProgress === ruleToDelete ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}