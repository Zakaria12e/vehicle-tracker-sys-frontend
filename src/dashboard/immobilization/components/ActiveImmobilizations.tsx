"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Unlock } from "lucide-react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

interface Immobilization {
  _id: string;
  vehicle: {
    name: string;
    licensePlate: string;
  };
  createdAt: string;
  reason: string;
  status: "active" | "inactive";
}

export const ActiveImmobilizations = () => {
  const [immobilizations, setImmobilizations] = useState<Immobilization[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)

const fetchData = async () => {
  setImmobilizations([])
  try {
    const res = await fetch(`${API_URL}/immobilizations?status=active`, {
      credentials: "include",
    })
    const data = await res.json()

    if (res.ok && Array.isArray(data.data?.immobilizations)) {
      setImmobilizations(data.data.immobilizations)
    } else {
      toast.error(data.message || "Failed to fetch active immobilizations")
    }
  } catch (err) {
    toast.error("Unable to fetch data from server")
  }
}


  useEffect(() => {
    fetchData()
  }, [])

  const handleRelease = async (id: string) => {
    setLoadingId(id)
    try {
      const res = await fetch(`${API_URL}/immobilizations/${id}/mobilize`, {
        method: "POST",
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Vehicle mobilized successfully")
        setImmobilizations((prev) => prev.filter((immob) => immob._id !== id))
      } else {
        toast.error(data.message || "Failed to release vehicle")
      }
    } catch (err) {
      toast.error("Server error during release")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Immobilized Vehicles</CardTitle>
        <CardDescription>Vehicles that are currently immobilized</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {immobilizations.map((item) => (
            <div key={item._id} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.vehicle.licensePlate}</p>
                </div>
                <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs text-red-800 dark:text-red-400 h-fit">
                  {item.status}
                </span>
              </div>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Since:</span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span>{item.reason}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1 w-full"
                onClick={() => handleRelease(item._id)}
                disabled={loadingId === item._id}
              >
                <Unlock className="h-3 w-3" />
                {loadingId === item._id ? "Releasing..." : "Release"}
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                  <th className="px-4 py-3 text-left font-medium">License Plate</th>
                  <th className="px-4 py-3 text-left font-medium">Immobilized Since</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {immobilizations.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="px-4 py-3">{item.vehicle.name}</td>
                    <td className="px-4 py-3">{item.vehicle.licensePlate}</td>
                    <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.reason}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs text-red-800 dark:text-red-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleRelease(item._id)}
                        disabled={loadingId === item._id}
                      >
                        <Unlock className="h-3 w-3" />
                        {loadingId === item._id ? "Releasing..." : "Release"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
