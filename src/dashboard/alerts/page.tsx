import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateAlertDialog } from "./components/CreateAlertDialog"
import { CurrentAlerts } from "./components/CurrentAlerts"
import { AlertRules } from "./components/AlertRules"
import { AlertHistory } from "./components/AlertHistory"
import { NotificationPreferences } from "./components/NotificationPreferences"

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6 p-3 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="mb-2 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-sm md:text-base text-muted-foreground">Configure alerts and notification preferences</p>
        </div>
        <CreateAlertDialog />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-2 md:mb-4 h-9 w-full sm:w-auto">
            <TabsTrigger value="active" className="text-xs sm:text-sm">Active Alerts</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">Alert History</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Notification Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-4 mt-0">
          <CurrentAlerts />
          <AlertRules />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-0">
          <AlertHistory />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-0">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  )
}