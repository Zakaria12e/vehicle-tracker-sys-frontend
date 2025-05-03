import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateAlertDialog } from "./components/CreateAlertDialog"
import { CurrentAlerts } from "./components/CurrentAlerts"
import { AlertRules } from "./components/AlertRules"
import { AlertHistory } from "./components/AlertHistory"
import { NotificationPreferences } from "./components/NotificationPreferences"

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Configure alerts and notification preferences</p>
        </div>
        <CreateAlertDialog />
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <CurrentAlerts />
          <AlertRules />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <AlertHistory />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  )
}
