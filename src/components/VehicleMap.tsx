import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen"; // Important : active le contrôle Fullscreen
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Battery, Gauge, Power, MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { motion } from "framer-motion";

type Props = {
  devices: any[];
  selectedVehicle: string;
  triggerZoom: boolean;
  geofences?: any[];
};

const defaultCenter: [number, number] = [31.7917, -7.0926];

const MapAutoZoom = ({ vehicle, isAllSelected, triggerZoom }: { vehicle: any; isAllSelected: boolean; triggerZoom: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (triggerZoom) {
      if (isAllSelected) {
        map.flyTo(defaultCenter, 6, { animate: true, duration: 1 });
      } else if (vehicle && vehicle.lat !== 0 && vehicle.lon !== 0) {
        map.flyTo([vehicle.lat, vehicle.lon], 14, { animate: true, duration: 3 });
      }
    }
  }, [vehicle, isAllSelected, triggerZoom, map]);

  return null;
};

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    if (map && !(map as any)._fullscreenControlAdded) {
      // @ts-ignore : Leaflet ne connait pas 'fullscreen' sans d.ts
      L.control.fullscreen({
        position: 'topright',
        title: 'Expand Map',
        titleCancel: 'Exit Fullscreen',
      }).addTo(map);

      (map as any)._fullscreenControlAdded = true;
    }
  }, [map]);

  return null;
};

const createCustomMarker = (status: string) => {
  const getColor = () => {
    switch (status) {
      case "moving": return "#10b981";
      case "stopped": return "#f59e0b";
      case "inactive": return "#6b7280";
      default: return "#ef4444";
    }
  };

  const iconMarkup = renderToStaticMarkup(
    <div className="relative">
      <MapPin size={36} color={getColor()} fill={getColor()} fillOpacity={0.4} strokeWidth={2} />
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "moving":
      return <Badge className="bg-green-100 text-green-700 border-green-200">{status}</Badge>;
    case "stopped":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{status}</Badge>;
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    default:
      return <Badge className="bg-red-100 text-red-700 border-red-200">{status}</Badge>;
  }
};

const VehicleMap: React.FC<Props> = ({ devices, selectedVehicle, triggerZoom, geofences = [] }) => {
  const visibleDevices = devices.filter(
    (v) => selectedVehicle === "all" || v.imei === selectedVehicle
  );

  const focusedVehicle =
    selectedVehicle === "all"
      ? null
      : devices.find((v) => v.imei === selectedVehicle);

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer center={defaultCenter} zoom={6} className="h-full w-full z-0 shadow-sm">
        {/* Tiles */}
        <TileLayer
          className="block dark:hidden"
          attribution='&copy; Esri & contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          className="hidden dark:block"
          attribution='&copy; Carto'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Fullscreen control */}
        <FullscreenControl />

        {/* Auto Zoom */}
        <MapAutoZoom vehicle={focusedVehicle} isAllSelected={selectedVehicle === "all"} triggerZoom={triggerZoom} />

        {/* Markers */}
        {visibleDevices.map((v) => (
          <Marker key={v.imei} position={[v.lat, v.lon]} icon={createCustomMarker(v.currentStatus)}>
            <Popup>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="border-0 shadow-none w-[250px] dark:bg-black">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-base flex items-center gap-1.5">
                        <Car className="h-4 w-4" /> {v.name}
                      </div>
                      {getStatusBadge(v.currentStatus)}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">IMEI</span>
                        <span className="font-mono text-xs">{v.imei}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />Speed</span>
                        <span>{v.speed ?? "--"} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5"><Battery className="h-3.5 w-3.5" />Battery</span>
                        <span>{v.extendedData?.vehicleBattery ?? "--"}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5"><Power className="h-3.5 w-3.5" />Ignition</span>
                        <span>{v.ignition ? "On" : "Off"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Popup>
          </Marker>
        ))}

        {/* Geofences */}
        {geofences.map((geofence, index) => (
          <React.Fragment key={index}>
            <Circle
              center={[geofence.center.lat, geofence.center.lon]}
              radius={geofence.radius}
              pathOptions={{ color: "cyan", weight: 2, fillOpacity: 0.1 }}
            />
            <Marker
              position={[geofence.center.lat, geofence.center.lon]}
              icon={L.divIcon({
                className: "geofence-label",
                html: `<div style="font-size: 12px; font-weight: bold; color:rgb(29, 216, 157); text-shadow: 0 0 1px white">${geofence.name}</div>`,
                iconSize: [100, 20],
                iconAnchor: [50, 10],
              })}
              interactive={false}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default VehicleMap;
