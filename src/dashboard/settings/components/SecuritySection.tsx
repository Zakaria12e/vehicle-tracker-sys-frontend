"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/updatepassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Change your password and manage security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Fields */}
        {["current", "new", "confirm"].map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={`${field}-password`}>{field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm Password"}</Label>
            <div className="relative">
              <Input
                id={`${field}-password`}
                type={showPasswords[field as keyof typeof showPasswords] ? "text" : "password"}
                value={field === "current" ? currentPassword : field === "new" ? newPassword : confirmPassword}
                onChange={(e) =>
                  field === "current"
                    ? setCurrentPassword(e.target.value)
                    : field === "new"
                    ? setNewPassword(e.target.value)
                    : setConfirmPassword(e.target.value)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => toggleVisibility(field as keyof typeof showPasswords)}
              >
                {showPasswords[field as keyof typeof showPasswords] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ))}
        <Separator />
        {/* 2FA Placeholder */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Badge variant="outline">Not Enabled</Badge>
        </div>
        <Button onClick={handlePasswordChange} disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
}