import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, Globe, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <TabsList className="flex flex-col h-auto p-0 bg-transparent space-y-1">
              <TabsTrigger value="profile" className="justify-start cursor-pointer px-4 py-2 h-9 w-[150px] data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start cursor-pointer px-4 py-2 h-9 w-[150px] data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start px-4 cursor-pointer py-2 h-9 data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences" className="justify-start cursor-pointer px-4 py-2 h-9 data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <Globe className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
             
              <Separator className="my-4" />
              <Button variant="ghost" className="justify-start cursor-pointer px-4 h-9 font-normal text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </TabsList>
          </div>
          <div className="flex-1 space-y-4">
            {children}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
