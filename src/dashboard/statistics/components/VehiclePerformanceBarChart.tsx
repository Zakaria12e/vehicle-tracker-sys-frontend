"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Vehicle {
  vehicleName: string;
  totalDistance: number;
  totalTrips: number;
  averageSpeed: number;
}

interface Props {
  vehicles: Vehicle[];
  COLORS: string[];
  loading: boolean;
  period: string;
}

export function VehiclePerformanceBarChart({
  vehicles,
  COLORS,
  loading,
  period,
}: Props) {
  const [activeMetric, setActiveMetric] = React.useState<
    "totalDistance" | "totalTrips" | "averageSpeed"
  >("totalDistance");

  const topVehicles = [...vehicles]
    .sort((a, b) => b[activeMetric] - a[activeMetric])
    .slice(0, 20);

  const chartConfig = {
    totalDistance: {
      label: "Total Distance (km)",
      color: COLORS[0],
    },
    totalTrips: {
      label: "Total Trips",
      color: COLORS[1],
    },
    averageSpeed: {
      label: "Average Speed (km/h)",
      color: COLORS[4],
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Vehicle Performance</CardTitle>
          <CardDescription>
            Top 20 vehicles - {chartConfig[activeMetric].label} ({period})
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveMetric("totalDistance")}
            className={`px-3 py-1 rounded text-xs font-medium ${
              activeMetric === "totalDistance"
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground"
            }`}
          >
            Distance
          </button>
          <button
            onClick={() => setActiveMetric("totalTrips")}
            className={`px-3 py-1 rounded text-xs font-medium ${
              activeMetric === "totalTrips"
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground"
            }`}
          >
            Trips
          </button>
          <button
            onClick={() => setActiveMetric("averageSpeed")}
            className={`px-3 py-1 rounded text-xs font-medium ${
              activeMetric === "averageSpeed"
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground"
            }`}
          >
            Avg Speed
          </button>
        </div>
      </CardHeader>

      <CardContent className="lg:h-[470px] sm:h-[300px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Loading chart...</span>
          </div>
        ) : (
          <ChartContainer
            config={{
              [activeMetric]: {
                label: chartConfig[activeMetric].label,
                color: chartConfig[activeMetric].color,
              },
            }}
          >
            <BarChart
              layout="vertical"
              data={topVehicles}
              margin={{ top: 10, right: 30, left: -80, bottom: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="vehicleName"
                type="category"
                tick={{ fontSize: 10 }}
                width={150}
              />
              <ChartTooltip
                content={<ChartTooltipContent nameKey={activeMetric} />}
              />
              <Bar
                dataKey={activeMetric}
                fill={chartConfig[activeMetric].color}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
