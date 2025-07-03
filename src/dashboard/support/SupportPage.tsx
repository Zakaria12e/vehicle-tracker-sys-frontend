"use client"

import { Construction } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  return (
    <div className="flex justify-center items-center h-full p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Construction className="mx-auto mb-2 h-10 w-10 text-yellow-500" />
          <CardTitle>Support Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. We're working hard to bring you an amazing support experience. 🚧
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
