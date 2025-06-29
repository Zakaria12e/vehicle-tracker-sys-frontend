"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImmobilizeDialog } from "./components/ImmobilizeDialog"
import { ActiveImmobilizations } from "./components/ActiveImmobilizations"
import { ImmobilizationHistory } from "./components/ImmobilizationHistory"
import { ImmobilizationGuide } from "./components/ImmobilizationGuide"
import { toast } from "sonner"
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL

export default function ImmobilizationPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchParams] = useSearchParams();
  const vehicleFromUrl = searchParams.get("vehicle");

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1)

   useEffect(() => {
    if (vehicleFromUrl) {
      setSelectedVehicle(vehicleFromUrl);
    }
  }, [vehicleFromUrl]);
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${API_URL}/vehicles`, { credentials: "include" })
        const data = await res.json()
        if (res.ok) {
          setVehicles(data.data.vehicles)
        } else {
          toast.error("Failed to fetch vehicles")
        }
      } catch (error) {
        toast.error("Unable to connect to server")
      }
    }

    fetchVehicles()
  }, [])

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-8 max-w-[100vw] ml-[-12px] overflow-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Vehicle Immobilization</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Remotely immobilize vehicles in your fleet
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v._id} value={v._id}>
                  {v.name} ({v.licensePlate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ImmobilizeDialog
            vehicleId={selectedVehicle}
            disabled={!selectedVehicle}
            onSuccess={triggerRefresh}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4 w-full overflow-x-auto whitespace-nowrap">
          <TabsTrigger value="active" className="flex-1">Active Immobilizations</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Immobilization History</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <ActiveImmobilizations refreshTrigger={refreshTrigger} />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <ImmobilizationHistory />
        </TabsContent>
      </Tabs>

      <ImmobilizationGuide />
    </div>
  )
}
