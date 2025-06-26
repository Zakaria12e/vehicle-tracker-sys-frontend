"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function PreferencesSection() {
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("utc");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Settings</CardTitle>
        <CardDescription>Configure your regional preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger><SelectValue placeholder="Select Timezone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
              <SelectItem value="cet">Central European Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button><Save className="mr-2 h-4 w-4" />Save Preferences</Button>
      </CardContent>
    </Card>
  );
}