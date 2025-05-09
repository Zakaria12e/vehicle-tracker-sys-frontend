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
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-8 max-w-[100vw] ml-[-12px] overflow-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Vehicle Immobilization</h1>
          <p className="text-sm text-muted-foreground md:text-base">Remotely immobilize vehicles in your fleet</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
      
      <Tabs defaultValue="active" className="w-full">
      <TabsList className="mb-4 w-full overflow-x-auto whitespace-nowrap">

          <TabsTrigger value="active" className="flex-1">Active Immobilizations</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Immobilization History</TabsTrigger>
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