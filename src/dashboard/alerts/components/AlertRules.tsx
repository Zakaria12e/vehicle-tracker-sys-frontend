import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import axios from "axios"

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

export function AlertRules() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  const fetchRules = async () => {
    try {
      const res = await axios.get(`${API_URL}/alert-rules`, { withCredentials: true })
      setRules(res.data as AlertRule[])
    } catch (err) {
      toast.error("Failed to load alert rules")
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedRule(expandedRule === id ? null : id)
  }

  const toggleRule = async (ruleId: string) => {
    try {
      const res = await axios.patch<{ enabled: boolean }>(`${API_URL}/alert-rules/${ruleId}/toggle`, {}, { withCredentials: true })
      setRules((prev) => prev.map(r => r._id === ruleId ? { ...r, enabled: res.data.enabled } : r))
    } catch {
      toast.error("Failed to toggle rule")
    }
  }

  const deleteRule = async (ruleId: string) => {
    try {
      await axios.delete(`${API_URL}/alert-rules/${ruleId}`, { withCredentials: true })
      setRules((prev) => prev.filter((r) => r._id !== ruleId))
      toast.success("Rule deleted")
    } catch {
      toast.error("Failed to delete rule")
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Rules</CardTitle>
        <CardDescription>Manage your configured alert rules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alert rules found.</p>
          ) : (
            rules.map((rule) => (
              <div key={rule._id} className="rounded-lg border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">{rule.name}</div>
                    {rule.threshold && (
                      <div className="text-sm text-muted-foreground">
                        Threshold: {rule.threshold}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground md:block">
                      Notifications: {rule.notifications.email ? "Email" : ""} {rule.notifications.app ? "App" : ""}
                    </div>
                  </div>

                  {/* Desktop Controls */}
                  <div className="hidden md:flex items-center gap-2 mt-0">
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule._id)} />
                    <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteRule(rule._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>

                  {/* Mobile Toggle & Expand */}
                  <div className="flex items-center justify-between md:hidden mt-3">
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule._id)} />
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(rule._id)} className="text-muted-foreground">
                      {expandedRule === rule._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Mobile Expanded Actions */}
                  {expandedRule === rule._id && (
                    <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
                      <Button variant="outline" size="sm" className="w-full"><Settings className="h-4 w-4 mr-2" /> Settings</Button>
                      <Button variant="outline" size="sm" className="w-full text-red-600" onClick={() => deleteRule(rule._id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
