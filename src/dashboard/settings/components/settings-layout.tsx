import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    <div className="flex flex-col gap-4 p-3 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col gap-4 lg:gap-6 lg:flex-row">
          {/* Navigation Menu */}
          <div className="w-full lg:w-[200px] lg:flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 h-auto p-0 bg-transparent gap-2">
              <TabsTrigger 
                value="profile" 
                className="justify-start cursor-pointer px-3 py-2 h-9 w-full text-sm 
                         rounded-md data-[state=active]:bg-muted hover:bg-muted/80 transition-colors"
              >
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Profile</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="security" 
                className="justify-start cursor-pointer px-3 py-2 h-9 w-full text-sm 
                         rounded-md data-[state=active]:bg-muted hover:bg-muted/80 transition-colors"
              >
                <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Security</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="notifications" 
                className="justify-start px-3 cursor-pointer py-2 h-9 w-full text-sm 
                         rounded-md data-[state=active]:bg-muted hover:bg-muted/80 transition-colors"
              >
                <Bell className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Notifications</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="preferences" 
                className="justify-start cursor-pointer px-3 py-2 h-9 w-full text-sm 
                         rounded-md data-[state=active]:bg-muted hover:bg-muted/80 transition-colors"
              >
                <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Preferences</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Separator and Logout (Hidden on Mobile) */}
            <div className="hidden lg:block">
              <Separator className="my-4" />
              <Button 
                variant="ghost" 
                className="justify-start w-full cursor-pointer px-3 py-2 h-9 font-normal text-red-600 
                         hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Log out</span>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-4 bg-card rounded-md p-3 sm:p-4 shadow-sm">
            {children}
          </div>
        </div>
        
        {/* Mobile Logout Button */}
        <div className="mt-6 lg:hidden">
          <Separator className="mb-4" />
          <Button 
            variant="ghost" 
            className="justify-center w-full cursor-pointer px-3 py-2 h-9 font-normal text-red-600 
                     hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Log out</span>
          </Button>
        </div>
      </Tabs>
    </div>
  );
}