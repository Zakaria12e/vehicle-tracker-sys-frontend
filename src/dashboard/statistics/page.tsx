"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Car, Clock, MapPin } from "lucide-react"

export default function StatisticsPage() {
  const [period, setPeriod] = useState("month")

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">Analyze your fleet performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month" value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 km</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 km</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Driving Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 h</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
       
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">By Vehicle</TabsTrigger>
          <TabsTrigger value="drivers">By Driver</TabsTrigger>
          <TabsTrigger value="routes">By Route</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
               
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
             
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Performance</CardTitle>
              <CardDescription>Comparative analysis of all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Vehicle</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Distance</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Trips</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Driving Time</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Avg. Speed</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Fuel Used</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">Toyota Corolla</td>
                      <td className="whitespace-nowrap px-4 py-3">1,845 km</td>
                      <td className="whitespace-nowrap px-4 py-3">58</td>
                      <td className="whitespace-nowrap px-4 py-3">42h 15m</td>
                      <td className="whitespace-nowrap px-4 py-3">44 km/h</td>
                      <td className="whitespace-nowrap px-4 py-3">138 L</td>
                      <td className="whitespace-nowrap px-4 py-3">7.5 L/100km</td>
                    </tr>
                    <tr className="border-b">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">Ford Transit</td>
                      <td className="whitespace-nowrap px-4 py-3">2,156 km</td>
                      <td className="whitespace-nowrap px-4 py-3">45</td>
                      <td className="whitespace-nowrap px-4 py-3">58h 30m</td>
                      <td className="whitespace-nowrap px-4 py-3">37 km/h</td>
                      <td className="whitespace-nowrap px-4 py-3">258 L</td>
                      <td className="whitespace-nowrap px-4 py-3">12.0 L/100km</td>
                    </tr>
                    <tr className="border-b">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">Honda Civic</td>
                      <td className="whitespace-nowrap px-4 py-3">891 km</td>
                      <td className="whitespace-nowrap px-4 py-3">39</td>
                      <td className="whitespace-nowrap px-4 py-3">28h 00m</td>
                      <td className="whitespace-nowrap px-4 py-3">32 km/h</td>
                      <td className="whitespace-nowrap px-4 py-3">93 L</td>
                      <td className="whitespace-nowrap px-4 py-3">6.8 L/100km</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
