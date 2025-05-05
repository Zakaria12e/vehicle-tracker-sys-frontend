import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, Globe, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <TabsList className="grid grid-cols-2 md:flex md:flex-col h-auto p-0 bg-transparent gap-2 md:gap-0 md:space-y-2">
              <TabsTrigger value="profile" className="justify-center cursor-pointer px-4 py-2 h-9 w-full md:w-[150px] data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-center cursor-pointer px-4 py-2 h-9 w-full md:w-[150px] data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-center px-4 cursor-pointer py-2 h-9 w-full md:w-[150px] data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences" className="justify-start cursor-pointer px-4 py-2 h-9 w-full md:w-[150px] data-[state=active]:bg-muted hover:bg-muted transition-colors">
                <Globe className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <Separator className="my-4 hidden md:block" />
              <Button variant="ghost" className="justify-start cursor-pointer px-4 h-9 font-normal text-red-600" onClick={handleLogout}>
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
