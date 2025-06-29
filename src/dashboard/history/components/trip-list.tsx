"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Car,
  Clock,
  Route,
  Gauge,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
  model?: string;
}

interface Trip {
  _id: string;
  vehicle: Vehicle | string;
  startTime: string;
  endTime?: string;
  summary: {
    distance: number;
    distanceFromOdometer: number;
    duration: number;
    averageSpeed: number;
    maxSpeed: number;
  };
  startLocation: {
    coordinates: [number, number];
    timestamp: string;
  };
  endLocation?: {
    coordinates: [number, number];
    timestamp: string;
  };
}

interface TripListProps {
  trips: Trip[];
  onViewTrip: (tripId: string) => void;
  loading?: boolean;
}

// Utilities
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
}

export function TripList({
  trips,
  onViewTrip,
  loading = false,
}: TripListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(trips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTrips = trips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Trip List</CardTitle>
        <CardDescription>
          Detailed list of all trips in the selected period
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No trips found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see trip data.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="space-y-4 sm:hidden">
              {currentTrips.map((trip) => {
                const startDate = formatDate(trip.startTime);
                const startTime = formatTime(trip.startTime);
                const endTime = trip.endTime ? formatTime(trip.endTime) : "--";
                const duration = formatDuration(trip.summary.duration);
                const vehicleName =
                  typeof trip.vehicle === "string"
                    ? trip.vehicle
                    : trip.vehicle?.name;

                return (
                  <Card key={trip._id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{vehicleName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {startDate}
                        </p>
                      </div>
                      <Badge variant="secondary">{duration}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {startTime} - {endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-muted-foreground" />
                        <div>
                          {(trip.summary.distance > 0
                            ? trip.summary.distance
                            : trip.summary.distanceFromOdometer
                          ).toFixed(2)}{" "}
                          km
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span>{trip.summary.averageSpeed.toFixed(1)} km/h</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => onViewTrip(trip._id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Card>
                );
              })}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <div className="rounded-md border">
                <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 font-medium text-sm">
                  <div>Vehicle</div>
                  <div>Date</div>
                  <div>Start</div>
                  <div>End</div>
                  <div>Duration</div>
                  <div>Distance</div>
                  <div>Avg Speed</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {currentTrips.map((trip) => {
                    const startDate = formatDate(trip.startTime);
                    const startTime = formatTime(trip.startTime);
                    const endTime = trip.endTime
                      ? formatTime(trip.endTime)
                      : "--";
                    const duration = formatDuration(trip.summary.duration);
                    const vehicleName =
                      typeof trip.vehicle === "string"
                        ? trip.vehicle
                        : trip.vehicle?.name;

                    return (
                      <div
                        key={trip._id}
                        className="grid grid-cols-8 gap-4 p-4 text-sm hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-medium">{vehicleName}</div>
                        <div>{startDate}</div>
                        <div>{startTime}</div>
                        <div>{endTime}</div>
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {duration}
                          </Badge>
                        </div>
                        <div>
                          {(trip.summary.distance > 0
                            ? trip.summary.distance
                            : trip.summary.distanceFromOdometer
                          ).toFixed(1)}{" "}
                          km
                        </div>

                        <div>{trip.summary.averageSpeed.toFixed(1)} km/h</div>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => onViewTrip(trip._id)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + ITEMS_PER_PAGE, trips.length)} of{" "}
                    {trips.length} trips
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

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let page = i + 1;
                          if (totalPages > 5) {
                            if (currentPage > 3) {
                              page = currentPage - 2 + i;
                            }
                            if (currentPage > totalPages - 2) {
                              page = totalPages - 4 + i;
                            }
                          }

                          return (
                            <Button
                              key={page}
                              variant={
                                page === currentPage ? "default" : "outline"
                              }
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => goToPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

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
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
