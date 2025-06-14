import React, { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

type Props = {
  devices: any[];
  selectedVehicle: string;
};

const defaultCenter: [number, number] = [31.7917, -7.0926];

const MapAutoZoom = ({ vehicle, isAllSelected, triggerZoom }: { vehicle: any; isAllSelected: boolean; triggerZoom: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (triggerZoom) {
      if (isAllSelected) {
        map.flyTo(defaultCenter, 6, {
          animate: true,
          duration: 1,
          easeLinearity: 0.25,
        });
      } else if (vehicle && vehicle.lat !== 0 && vehicle.lon !== 0) {
        map.flyTo([vehicle.lat, vehicle.lon], 14, {
          animate: true,
          duration: 3,
          easeLinearity: 0.25,
        });
      }
    }
  }, [vehicle, isAllSelected, triggerZoom, map]);

  return null;
};
  

const createCustomMarker = (status: string) => {
  const getColor = () => {
    switch (status) {
      case "moving":
        return "#10b981";
      case "stopped":
        return "#f59e0b";
      case "inactive":
        return "#6b7280";
      default:
        return "#ef4444";
    }
  };

  const iconMarkup = renderToStaticMarkup(
    <div className="relative">
      <MapPin
        size={36}
        color={getColor()}
        fill={getColor()}
        fillOpacity={0.4}
        strokeWidth={2}
      />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: "custom-vehicle-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};


const VehicleDashboardMap: React.FC<Props & { triggerZoom: boolean; geofences?: any[] }> = ({ devices, selectedVehicle, triggerZoom, geofences = [] }) => {
  const visibleDevices = devices.filter(
    (v) => selectedVehicle === "all" || v.imei === selectedVehicle
  );

  const focusedVehicle =
    selectedVehicle === "all"
      ? null
      : devices.find((v) => v.imei === selectedVehicle);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={6}
      className="h-full w-full z-0 rounded-lg shadow-sm"
    >
      <TileLayer
        className="block dark:hidden"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a> & contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />

      {/* Dark theme tile layer */}
      <TileLayer
        className="hidden dark:block"
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapAutoZoom
        vehicle={focusedVehicle}
        isAllSelected={selectedVehicle === "all"}
        triggerZoom={triggerZoom}
      />

      {visibleDevices.map((v) => (
        <Marker
          key={v.imei}
          position={[v.lat, v.lon]}
          icon={createCustomMarker(v.currentStatus)}
        >
        </Marker>
      ))}

      {geofences.map((geofence, index) => (
        <React.Fragment key={index}>
          <Circle
            center={[geofence.center.lat, geofence.center.lon]}
            radius={geofence.radius}
            pathOptions={{ color: "blue", weight: 2, fillOpacity: 0.1 }}
          />
          <Marker
            position={[geofence.center.lat, geofence.center.lon]}
            icon={L.divIcon({
              className: 'geofence-label',
              html: `<div style="font-size: 12px; font-weight: bold; color: #1d4ed8; text-shadow: 0 0 2px white">${geofence.name}</div>`,
              iconSize: [100, 20],
              iconAnchor: [50, 10],
            })}
            interactive={false}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default VehicleDashboardMap;
