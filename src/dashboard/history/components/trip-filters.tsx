"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Filter, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command"

interface Vehicle {
  _id: string
  name: string
  licensePlate: string
}

interface TripFiltersProps {
  vehicles: Vehicle[]
  startDate: Date | undefined
  endDate: Date | undefined
  selectedVehicle: string
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  onVehicleChange: (value: string) => void
  onApplyFilters: () => void
  loading?: boolean
}

export function TripFilters({
  vehicles,
  startDate,
  endDate,
  selectedVehicle,
  onStartDateChange,
  onEndDateChange,
  onVehicleChange,
  onApplyFilters,
  loading = false,
}: TripFiltersProps) {
  const [vehicleOpen, setVehicleOpen] = useState(false)

  const canApplyFilters = startDate && endDate && !loading && (selectedVehicle !== "all")

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Trip Filters</CardTitle>
        <CardDescription>Select a vehicle and date range to view trip history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Vehicle Searchable Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle</label>
            <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={vehicleOpen}
                  className="w-full justify-between h-10"
                  disabled={loading}
                >
                  {selectedVehicle === "all"
                    ? "All Vehicles"
                    : vehicles.find(v => v._id === selectedVehicle)
                      ? `${vehicles.find(v => v._id === selectedVehicle)?.name} (${vehicles.find(v => v._id === selectedVehicle)?.licensePlate})`
                      : "Select vehicle"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search vehicle..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No vehicle found.</CommandEmpty>
                    <CommandItem onSelect={() => onVehicleChange("all")}>
                      All Vehicles
                    </CommandItem>
                    {vehicles.map((vehicle) => (
                      <CommandItem
                        key={vehicle._id}
                        onSelect={() => {
                          onVehicleChange(vehicle._id)
                          setVehicleOpen(false)
                        }}
                      >
                        {vehicle.name} ({vehicle.licensePlate})
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Start Date */}
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-medium sm:text-sm">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !startDate && "text-muted-foreground",
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={onStartDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal h-10", !endDate && "text-muted-foreground")}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={onEndDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Apply Filters Button */}
          <div className="flex items-end">
            <Button className="w-full h-10" onClick={onApplyFilters} disabled={!canApplyFilters}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
