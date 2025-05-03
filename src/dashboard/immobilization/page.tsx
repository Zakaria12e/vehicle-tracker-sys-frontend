"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImmobilizeDialog } from "./components/ImmobilizeDialog"
import { ActiveImmobilizations } from "./components/ActiveImmobilizations"
import { ImmobilizationHistory } from "./components/ImmobilizationHistory"
import { ImmobilizationGuide } from "./components/ImmobilizationGuide"

export default function ImmobilizationPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("")

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Immobilization</h1>
          <p className="text-muted-foreground">Remotely immobilize vehicles in your fleet</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toyota">Toyota Corolla</SelectItem>
              <SelectItem value="ford">Ford Transit</SelectItem>
              <SelectItem value="honda">Honda Civic</SelectItem>
            </SelectContent>
          </Select>
          <ImmobilizeDialog disabled={!selectedVehicle} />
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Immobilizations</TabsTrigger>
          <TabsTrigger value="history">Immobilization History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ActiveImmobilizations />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <ImmobilizationHistory />
        </TabsContent>
      </Tabs>

      <ImmobilizationGuide />
    </div>
  )
}
