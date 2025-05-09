"use client"

import { Car, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export default function VehicleLoader() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360)
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-25 h-25">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPin className="w-8 h-8 text-primary z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full animate-ping" />
          </div>
        </div>
      </div>
    </div>
  )
}
