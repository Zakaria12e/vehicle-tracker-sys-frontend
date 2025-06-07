import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrentAlerts } from "./components/CurrentAlerts"
import { AlertRules } from "./components/AlertRules"
import { AlertHistory } from "./components/AlertHistory"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6 p-3 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="mb-2 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-sm md:text-base text-muted-foreground">Configure alerts and notification preferences</p>
        </div>
        <Button
          asChild
          className="w-full justify-center self-center md:self-auto md:ml-auto md:w-auto md:h-8 md:text-sm"
        >
          <Link to="/alerts/create" className="gap-1 flex items-center justify-center">
            <Plus className="h-4 w-4" />
            Create Rule
          </Link>
        </Button>
      </div>
     

      <Tabs defaultValue="active" className="w-full">
        <div className="overflow-x-auto pb-2">
          
          <TabsList className="mb-4 w-full overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="active" className="flex-1">Active Alerts</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Alert History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-4 mt-0">
          <CurrentAlerts />
          <AlertRules />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-0">
          <AlertHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}