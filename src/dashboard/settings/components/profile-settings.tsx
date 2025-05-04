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
import { Save } from "lucide-react"

export function ProfileSettings() {

  const { user, setUser } = useAuth();

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
    }
  };


  return (
    <TabsContent value="profile" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Avatar className="h-16 w-16">
          <AvatarImage
  src={`http://localhost:5000${user?.photo}`}
  alt="User" crossOrigin="anonymous"
/>


              <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h3 className="font-semibold">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">JPG, PNG. Max 3MB</p>
              <div className="flex gap-2">
      
              <label className="relative inline-block">
  <Button variant="outline" size="sm" className="cursor-pointer">
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
                  className="text-red-600"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
              {file && <p className="text-sm text-green-600">Selected: {file.name}</p>}
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name"value={formData.name} onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="gap-1" onClick={handleSubmit}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
