import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"

export function ProfileSettings() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
  });

  const [file, setFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("company", formData.company);
    if (file) form.append("photo", file);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/updatedetails", {
        method: "PUT",
        credentials: "include",
        body: form
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.data);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="profile" className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg md:text-xl">Profile</CardTitle>
          <CardDescription className="text-sm">
            Manage your personal information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5 p-4 sm:p-6 pt-0 sm:pt-0">
          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Avatar className="h-16 w-16 border">
              <AvatarImage
                src={`http://localhost:5000${user?.photo}`}
                alt={user?.name || "User"}
                crossOrigin="anonymous"
              />
              <AvatarFallback className="text-lg">
                {user?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 w-full">
              <h3 className="font-medium text-sm">Profile Picture</h3>
              <p className="text-xs text-muted-foreground">JPG, PNG. Max 3MB</p>
              <div className="flex flex-wrap gap-2">
                <label className="relative inline-block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="cursor-pointer h-8 text-xs"
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </label>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 h-8 text-xs"
                  onClick={() => setFile(null)}
                  disabled={!file}
                >
                  Remove
                </Button>
              </div>
              {file && (
                <p className="text-xs text-green-600 truncate max-w-full">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <Input 
                id="name"
                value={formData.name} 
                onChange={handleChange} 
                className="h-9" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-sm">Company</Label>
              <Input 
                id="company" 
                value={formData.company} 
                onChange={handleChange} 
                className="h-9" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="h-9" 
                type="email" 
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end p-4 sm:p-6 pt-0 sm:pt-0">
          <Button 
            className="gap-2 h-9" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}