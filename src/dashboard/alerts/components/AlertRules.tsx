import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function AlertRules() {
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedRule(expandedRule === id ? null : id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Rules</CardTitle>
        <CardDescription>Manage your configured alert rules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Alert Rule Item */}
          <div className="rounded-lg border p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Speed Limit Alert</div>
                <div className="text-sm text-muted-foreground">Alert when vehicles exceed 90 km/h</div>
                <div className="text-xs text-muted-foreground md:block">Applied to: All Vehicles</div>
              </div>

              {/* Desktop controls */}
              <div className="hidden md:flex items-center gap-2 mt-0">
                <Switch defaultChecked />
                <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
              </div>

              {/* Mobile controls with expand/collapse */}
              <div className="flex items-center justify-between md:hidden mt-3">
                <Switch defaultChecked />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand('speed-rule')}
                  className="text-muted-foreground"
                >
                  {expandedRule === 'speed-rule' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Mobile expanded actions */}
              {expandedRule === 'speed-rule' && (
                <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Add more rules as needed */}
        </div>
      </CardContent>
    </Card>
  )
}