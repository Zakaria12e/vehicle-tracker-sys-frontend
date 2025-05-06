import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter: [number, number] = [31.7917, -7.0926];

interface Zone {
  center: { lat: number; lon: number };
  radius: number;
  _id?: string;
}

interface MapgeofencesProps {
  onZoneSelect?: (zone: { center: [number, number]; radius: number }) => void;
  zones?: Zone[];
  center?: [number, number] | null;

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

const Mapgeofences: React.FC<MapgeofencesProps> = ({ onZoneSelect, zones = [], center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);

  return (
    <>
      {zones.map((zone) => (
        <Circle
          key={zone._id || JSON.stringify(zone.center)}
          center={[zone.center.lat, zone.center.lon]}
          radius={zone.radius}
          pathOptions={{ color: "red", fillOpacity: 0.3 }}
        />
      ))}

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
