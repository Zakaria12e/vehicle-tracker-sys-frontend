"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, History, ChevronLeft, ChevronRight, X } from "lucide-react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL
const ITEMS_PER_PAGE = 4

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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const calculateDuration = (start: string, end: string): string => {
    const ms = new Date(end).getTime() - new Date(start).getTime()
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  // Filter and paginate data
  const filteredData = useMemo(() => {
    if (!searchTerm) return history
    
    const term = searchTerm.toLowerCase()
    return history.filter(item => 
      item.vehicle.name.toLowerCase().includes(term) ||
      item.vehicle.licensePlate.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    )
  }, [history, searchTerm])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  // Empty state when no history exists
  const EmptyHistoryState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 mb-4">
        <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No History Available
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        No immobilization history found. Released vehicles will appear here once they become available.
      </p>
      <Button 
        variant="outline" 
        onClick={fetchData} 
        className="mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  )

  // Empty state when search returns no results
  const NoSearchResultsState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No Results Found
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        No immobilization records match your search for "{searchTerm}". Try adjusting your search terms.
      </p>
      <Button 
        variant="outline" 
        onClick={clearSearch}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        Clear Search
      </Button>
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Immobilization History</CardTitle>
            <CardDescription>Past vehicle immobilizations</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search history..." 
              className="pl-8"
              disabled
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading history...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Immobilization History</CardTitle>
          <CardDescription>
            {history.length === 0 
              ? "Past vehicle immobilizations" 
              : searchTerm 
                ? `${filteredData.length} of ${history.length} records match "${searchTerm}"`
                : `${history.length} total records • Showing ${currentItems.length} of ${filteredData.length}`
            }
          </CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search by vehicle, plate, or reason..." 
            className="pl-8 pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <EmptyHistoryState />
        ) : filteredData.length === 0 ? (
          <NoSearchResultsState />
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
                      <span className="font-medium">{calculateDuration(item.createdAt, item.updatedAt)}</span>
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
                    {currentItems.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="px-4 py-3">{item.vehicle.name}</td>
                        <td className="px-4 py-3">{item.vehicle.licensePlate}</td>
                        <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">{new Date(item.updatedAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{calculateDuration(item.createdAt, item.updatedAt)}</span>
                        </td>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                  {searchTerm && (
                    <span className="ml-2">
                      • Filtered results
                    </span>
                  )}
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