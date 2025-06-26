"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Smartphone, Shield, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Email Notifications", desc: "Get important alerts via email", icon: Mail, value: emailNotifications, onChange: setEmailNotifications },
          { label: "Push Notifications", desc: "Receive updates on your device", icon: Smartphone, value: pushNotifications, onChange: setPushNotifications },
          { label: "Security Alerts", desc: "Critical account activity alerts", icon: Shield, value: securityAlerts, onChange: setSecurityAlerts },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <Switch checked={item.value} onCheckedChange={item.onChange} />
          </div>
        ))}
        <Button><Save className="mr-2 h-4 w-4" />Save Preferences</Button>
      </CardContent>
    </Card>
  );
}
