import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Circle , Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import clsx from "clsx"

const defaultCenter: [number, number] = [31.7917, -7.0926];

interface Zone {
  center: { lat: number; lon: number };
  name: string
  radius: number;
  _id?: string;
}

interface MapgeofencesProps {
  onZoneSelect?: (zone: { center: [number, number]; radius: number; name?: string }) => void;
  zones?: Zone[];
  center?: [number, number] | null;
  flyTo?: [number, number] | null;
}

const ZoneSelector = ({ onZoneSelect }: { onZoneSelect: (zone: { center: [number, number]; radius: number }) => void }) => {
  const [circle, setCircle] = useState<{ center: [number, number]; radius: number } | null>(null);

  useMapEvents({
    click(e) {
      const center: [number, number] = [e.latlng.lat, e.latlng.lng];
      const radius = 500;
      setCircle({ center, radius });
      onZoneSelect({ center, radius });
    },
  });

  return circle ? <Circle center={circle.center} radius={circle.radius} pathOptions={{ color: "blue" }} /> : null;
};

const Mapgeofences: React.FC<MapgeofencesProps> = ({ onZoneSelect, zones = [], flyTo }) => {

  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [flyTo, map]);
  
  const zoneColors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#8b5cf6", // violet-500
    "#f59e0b", // amber-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
    "#f43f5e", // rose-500
    "#6366f1", // indigo-500
  ];
  

  const getColor = (index: number): string => {
    return zoneColors[index % zoneColors.length];
  };
  


  return (
    <>
{zones.map((zone, index) => {
  const color = getColor(index);

  return (
    <Circle
      key={zone._id || JSON.stringify(zone.center)}
      center={[zone.center.lat, zone.center.lon]}
      radius={zone.radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.25,
      }}
    >
      <Tooltip
        permanent
        direction="top"
        offset={[0, -10]}
        className="leaflet-tooltip leaflet-tooltip-no-background !p-0 !bg-transparent !border-none !shadow-none"
      >
       <div
  className={`bg-[#0f0f0f] text-[13px] font-semibold px-[10px] py-[6px] rounded-[6px] border border-[#212121]`}
  style={{ color }}
>
          {zone.name}
        </div>
      </Tooltip>
    </Circle>
  );
})}



      {onZoneSelect && <ZoneSelector onZoneSelect={onZoneSelect} />}
    </>
  );
};

const MapgeofencesWrapper: React.FC<MapgeofencesProps> = (props) => {
  return (
    <MapContainer center={defaultCenter} zoom={6} className="h-full w-full z-0 rounded-lg shadow-sm">
      <TileLayer
        className="block dark:hidden"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a> & contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <TileLayer
        className="hidden dark:block"
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <Mapgeofences {...props} />
    </MapContainer>
  );
};

export default MapgeofencesWrapper;
