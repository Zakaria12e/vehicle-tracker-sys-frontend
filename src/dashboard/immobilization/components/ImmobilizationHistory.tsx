"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

interface HistoryItem {
  _id: string;
  vehicle: {
    name: string;
    licensePlate: string;
  };
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export const ImmobilizationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/immobilizations?status=inactive`, {
        credentials: "include"
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.data?.immobilizations)) {
        setHistory(data.data.immobilizations)
      } else {
        toast.error(data.message || "Failed to load history")
      }
    } catch (err) {
      toast.error("Unable to fetch immobilization history")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const calculateDuration = (start: string, end: string): string => {
    const ms = new Date(end).getTime() - new Date(start).getTime()
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Immobilization History</CardTitle>
          <CardDescription>Past vehicle immobilizations</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search history..." className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No past immobilizations found.</p>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {history.map((item) => (
                <div key={item._id} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.vehicle.licensePlate}</p>
                    </div>
                    <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-400 h-fit">
                      Released
                    </span>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Immobilized:</span>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Released:</span>
                      <span>{new Date(item.updatedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{calculateDuration(item.createdAt, item.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reason:</span>
                      <span>{item.reason}</span>
                    </div>
                  </div>
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
                      <th className="px-4 py-3 text-left font-medium">Immobilized</th>
                      <th className="px-4 py-3 text-left font-medium">Released</th>
                      <th className="px-4 py-3 text-left font-medium">Duration</th>
                      <th className="px-4 py-3 text-left font-medium">Reason</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="px-4 py-3">{item.vehicle.name}</td>
                        <td className="px-4 py-3">{item.vehicle.licensePlate}</td>
                        <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">{new Date(item.updatedAt).toLocaleString()}</td>
                        <td className="px-4 py-3">{calculateDuration(item.createdAt, item.updatedAt)}</td>
                        <td className="px-4 py-3">{item.reason}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-400">
                            Released
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
