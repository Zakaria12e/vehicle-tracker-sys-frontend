import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TripFiltersProps {
  startDate: Date | undefined
  endDate: Date | undefined
  selectedVehicle: string
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  onVehicleChange: (value: string) => void
  onApplyFilters: () => void
}

export function TripFilters({
  startDate,
  endDate,
  selectedVehicle,
  onStartDateChange,
  onEndDateChange,
  onVehicleChange,
  onApplyFilters,
}: TripFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Filters</CardTitle>
        <CardDescription>Select a vehicle and date range to view trip history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Vehicle Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle</label>
            <Select value={selectedVehicle} onValueChange={onVehicleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="toyota">Toyota Corolla</SelectItem>
                <SelectItem value="ford">Ford Transit</SelectItem>
                <SelectItem value="honda">Honda Civic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={onEndDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <Button className="w-full gap-1" onClick={onApplyFilters}>
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
