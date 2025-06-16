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
import { Unlock, ChevronLeft, ChevronRight, Car } from "lucide-react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL
const ITEMS_PER_PAGE = 4

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
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
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
        // Adjust current page if needed
        const newTotal = immobilizations.length - 1
        const maxPage = Math.ceil(newTotal / ITEMS_PER_PAGE)
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage)
        }
      } else {
        toast.error(data.message || "Failed to release vehicle")
      }
    } catch (err) {
      toast.error("Server error during release")
    } finally {
      setLoadingId(null)
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(immobilizations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = immobilizations.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-1 text-center">
      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-2">
        <Car className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No Active Immobilizations
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Great news! All vehicles are currently mobile. There are no immobilized vehicles at this time.
      </p>
    
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Currently Immobilized Vehicles</CardTitle>
          <CardDescription>Vehicles that are currently immobilized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading immobilizations...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="lg:text-left sm:text-center">
        <CardTitle>Currently Immobilized Vehicles</CardTitle>
        <CardDescription>
          {immobilizations.length === 0 
            ? "Vehicles that are currently immobilized" 
            : `Showing ${currentItems.length} of ${immobilizations.length} immobilized vehicles`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {immobilizations.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {currentItems.map((item) => (
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
                    {currentItems.map((item) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="min-w-[2.5rem]"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}