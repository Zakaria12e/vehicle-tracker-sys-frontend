"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";

interface HeatmapProps {
  period: string;
  apiUrl: string;
}

const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "orange",
        0.8: "red",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

export default function VehiclePlacesHeatmap({ period, apiUrl }: HeatmapProps) {
  const [heatmapPoints, setHeatmapPoints] = useState<[number, number, number][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/statistics/places-heatmap?period=${period}`, { credentials: "include" });
        const json = await res.json();

        const points: [number, number, number][] = json.data.map(
          (item: any) => [item.lat, item.lon, item.visitCount]
        );

        setHeatmapPoints(points);
      } catch (err) {
        console.error("Error fetching heatmap data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [period, apiUrl]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border">
      <MapContainer center={[31.7917, -7.0926]} zoom={6} style={{ height: "100%", width: "100%" }}>
        {/* Light Mode (ArcGIS Streets) */}
        <TileLayer
          className="block dark:hidden"
          attribution='&copy; Esri & contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Dark Mode (Carto Dark) */}
        <TileLayer
          className="hidden dark:block"
          attribution='&copy; Carto'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Heatmap Overlay */}
        {!loading && heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />}
      </MapContainer>
    </div>
  );
}
