"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen"; // Important pour activer le contrôle
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2 } from "lucide-react";

const defaultCenter: [number, number] = [31.7917, -7.0926];

const MapAutoZoom = ({ bounds }: { bounds: [[number, number], [number, number]] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { animate: true, duration: 1.5 });
    }
  }, [bounds, map]);
  return null;
};

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    if (map && !(map as any)._fullscreenControlAdded) {
      // @ts-ignore : Leaflet ne connaît pas 'fullscreen' sans d.ts
      L.control.fullscreen({
        position: "topright",
        title: "Expand Map",
        titleCancel: "Exit Fullscreen",
      }).addTo(map);

      (map as any)._fullscreenControlAdded = true;
    }
  }, [map]);

  return null;
};

interface Position {
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  speed: number;
}

interface Trip {
  _id: string;
}

interface TripMapProps {
  selectedTripId: string | null;
  allTrips: Trip[];
  loading?: boolean;
}

export function TripMap({ selectedTripId, allTrips, loading = false }: TripMapProps) {
  const [positions, setPositions] = useState<[number, number][][]>([]);
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllPositions = async () => {
      if (!allTrips.length) {
        setPositions([]);
        setBounds(null);
        return;
      }

      setMapLoading(true);
      const allCoords: [number, number][][] = [];

      for (const trip of allTrips) {
        try {
          const res = await fetch(`${API_URL}/trips/positions/byTrip/${trip._id}`, {
            credentials: "include",
          });
          const data: Position[] = await res.json();

          const coords = data
            .map((p) => [p.location.coordinates[1], p.location.coordinates[0]])
            .filter((c): c is [number, number] => c.length === 2 && c.every((n) => typeof n === "number"));

          if (coords.length > 0) {
            allCoords.push(coords);
          }
        } catch (err) {
          console.error(`Failed to load positions for trip ${trip._id}:`, err);
        }
      }

      const flat = allCoords.flat();
      setPositions(allCoords);

      if (flat.length > 1) {
        const lats = flat.map((c) => c[0]);
        const lons = flat.map((c) => c[1]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        setBounds([
          [minLat, minLon],
          [maxLat, maxLon],
        ]);
      } else {
        setBounds(null);
      }

      setMapLoading(false);
    };

    fetchAllPositions();
  }, [allTrips, API_URL]);

  return (
    <Card className="w-full lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Trip Map</CardTitle>
            <CardDescription>All filtered trip routes are shown</CardDescription>
          </div>
          {allTrips.length > 0 && (
            <Badge variant="secondary">
              {allTrips.length} trip{allTrips.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[250px] p-0 sm:h-[300px] md:h-[350px] lg:h-[400px]">
        {loading || mapLoading ? (
          <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : allTrips.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-medium">No trips to display</h3>
                <p className="text-sm text-muted-foreground">Apply filters to see trip routes</p>
              </div>
            </div>
          </div>
        ) : (
          <MapContainer center={defaultCenter} zoom={6} className="h-full w-full rounded-lg">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              className="hidden dark:block"
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Fullscreen control */}
            <FullscreenControl />

            {positions.map((line, idx) => {
              const isSelected = allTrips[idx]?._id === selectedTripId;
              return (
                <Polyline
                  key={idx}
                  positions={line}
                  pathOptions={{
                    color: isSelected ? "#8200db" : "#00a6f4",
                    weight: isSelected ? 5 : 3,
                    opacity: isSelected ? 1 : 0.7,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              );
            })}

            <MapAutoZoom bounds={bounds} />
          </MapContainer>
        )}
      </CardContent>
    </Card>
  );
}