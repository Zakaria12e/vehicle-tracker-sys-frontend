"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Upload, Loader2 } from "lucide-react";

export default function ProfileSection() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
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
        body: form,
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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Avatar className="h-20 w-20 border-2">
          <AvatarImage src={`http://localhost:5000${user?.photo}`} />
          <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={formData.company} onChange={handleChange} />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
