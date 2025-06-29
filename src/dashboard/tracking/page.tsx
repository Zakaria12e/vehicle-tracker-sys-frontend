import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem
} from "@/components/ui/command"

import { io } from 'socket.io-client';
import { Locate, Battery, Car } from "lucide-react";
import { toast } from "sonner";
import VehicleMap from "@/components/VehicleMap";
import getRelativeTime from "@/components/relativeTime";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { VehicleControls } from "./components/VehicleControls";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

// Stagger container animation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const MapLoading = () => (
  <motion.div 
    className="h-full w-full flex items-center justify-center bg-muted/20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </motion.div>
);
const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});
export default function TrackingPage() {
  const { imei } = useParams();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState(imei || "all");
  const [showGeofences, setShowGeofences] = useState(true);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'details'>('map');
  const [geofences, setGeofences] = useState<any[]>([]);

  const handleLocateClick = () => {
    setTriggerZoom(true);
    setTimeout(() => setTriggerZoom(false), 1000);
  };

useEffect(() => {
  const loadInitialVehicles = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await fetch(`${API_URL}/vehicles`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        // ✅ Preprocess vehicles to include last known positions
        interface VehiclePosition {
          lat?: number | null;
          lon?: number | null;
          speed?: number;
          timestamp?: string | number | null;
          ignition?: boolean;
        }

        interface VehicleExtendedData {
          vehicleBattery?: number;
          [key: string]: any;
        }

        interface Vehicle {
          _id: string;
          imei: string;
          name: string;
          licensePlate: string;
          lastPosition?: VehiclePosition;
          lat: number | null;
          lon: number | null;
          speed: number;
          timestamp: string | number | null;
          ignition: boolean;
          currentStatus: string;
          extendedData: VehicleExtendedData;
        }

        interface VehiclesApiResponse {
          data: {
            vehicles: any[];
          };
        }

        const preparedVehicles: Vehicle[] = (data as VehiclesApiResponse).data.vehicles.map((v: any): Vehicle => ({
          ...v,
          lat: v.lastPosition?.lat ?? null,
          lon: v.lastPosition?.lon ?? null,
          speed: v.lastPosition?.speed ?? 0,
          timestamp: v.lastPosition?.timestamp ?? null,
          ignition: v.lastPosition?.ignition ?? false,
          currentStatus: v.currentStatus ?? 'inactive',
          extendedData: v.extendedData ?? {},
        }));

        setVehicles(preparedVehicles);

        // ✅ Join socket rooms for IMEIs
        const imeis: string[] = preparedVehicles.map((v) => v.imei);
        socket.emit("join_rooms", imeis);
      } else {
        toast.error("Failed to load vehicles");
      }
    } catch (err) {
      toast.error("Unable to connect to vehicle service");
    }
  };

  loadInitialVehicles();

  socket.on("vehicle_data", (data) => {
    setVehicles((prev) => {
      const index = prev.findIndex((v) => v.imei === data.imei);
      const updated = {
        ...(prev[index] || {}),
        lat: data.lat,
        lon: data.lon,
        speed: data.speed ?? data.speedGps ?? 0,
        ignition: data.ignition,
        timestamp: data.timestamp,
        currentStatus: data.ignition
          ? (data.speed ?? data.speedGps ?? 0) > 0
            ? 'moving'
            : 'stopped'
          : 'inactive',
        extendedData: {
          ...(prev[index]?.extendedData || {}),
          ...data.extendedData,
        },
      };

      if (index !== -1) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...updated };
        return copy;
      } else {
        return [...prev, updated];
      }
    });
  });

  return () => {
    socket.off("vehicle_data");
  };
}, []);



  const selected =
    selectedVehicle === 'all'
      ? null
      : vehicles.find((v) => v.imei === selectedVehicle);

  // Set details as active tab when a vehicle is selected on mobile
  useEffect(() => {
    if (selected && window.innerWidth < 768) {
      setActiveTab('details');
    }
  }, [selectedVehicle]);

  const fetchGeofences = async (vehicleId: string) => {
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/geofences/vehicle/${vehicleId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Wrap single geofence object in array to match expected format
        setGeofences(data.data ? [data.data] : []);
      } else {
        toast.error(res.statusText || "Failed to load geofences");
      }
    } catch (err) {
      toast.error("Unable to connect to geofence service");
    }
  };


  useEffect(() => {
    if (showGeofences && selectedVehicle !== "all") {
      const selectedVehicleId = vehicles.find((v) => v.imei === selectedVehicle)?._id;
      if (selectedVehicleId) {
        fetchGeofences(selectedVehicleId);
      }
    } else {
      setGeofences([]);
    }
  }, [showGeofences, selectedVehicle]);

  return (
    <motion.div 
      className="flex flex-col h-[100dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b p-3 sm:p-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Live Tracking</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor your vehicles in real-time
          </p>
        </div>
        <motion.div 
          className="flex items-center gap-2"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
        <Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className="h-9 w-full sm:w-[220px] justify-start text-sm"
    >
      {selectedVehicle === "all"
        ? "All Vehicles"
        : vehicles.find((v) => v.imei === selectedVehicle)
        ? `${vehicles.find((v) => v.imei === selectedVehicle)?.name} (${vehicles.find((v) => v.imei === selectedVehicle)?.licensePlate})`
        : "Select vehicle"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[300px] p-0">
    <Command>
      <CommandInput placeholder="Search vehicle..." className="h-9" />
      <CommandList>
        <CommandEmpty>No vehicle found.</CommandEmpty>
        <CommandItem onSelect={() => setSelectedVehicle("all")}>
          All Vehicles
        </CommandItem>
        {vehicles.map((v) => (
          <CommandItem
            key={v._id}
            onSelect={() => setSelectedVehicle(v.imei)}
          >
            {v.name} ({v.licensePlate})
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>

          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9" 
            onClick={handleLocateClick}
          >
            <Locate className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Mobile Tab Navigation */}
      <motion.div 
        className="md:hidden border-b py-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'map' | 'details')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="text-sm">
              <Locate className="h-3.5 w-3.5 mr-1.5" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm">
              <Car className="h-3.5 w-3.5 mr-1.5" />
              Vehicle Details
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Map + Details */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_320px] flex-1 overflow-hidden">
        {/* Map Section - Full height on desktop, conditional on mobile */}
        <AnimatePresence mode="wait">
          {(activeTab === 'map' || window.innerWidth >= 768) && (
            <motion.div 
              key="map-section"
              className={`relative ${activeTab === 'map' || window.innerWidth >= 768 ? 'h-full' : 'h-0'}`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<MapLoading />}>
              <VehicleMap
  devices={vehicles.filter(
    (v) => typeof v.lat === 'number' && typeof v.lon === 'number'
  )}
  selectedVehicle={selectedVehicle}
  triggerZoom={triggerZoom}
  geofences={showGeofences ? geofences : []}
  onSelectVehicle={(imei) => setSelectedVehicle(imei)}
/>

              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Panel - Always visible on desktop, conditional on mobile */}
        <AnimatePresence mode="wait">
          {(activeTab === 'details' || window.innerWidth >= 768) && (
            <motion.div 
              key="details-section"
              className={`border-t md:border-t-0 md:border-l overflow-auto bg-background ${activeTab === 'details' || window.innerWidth >= 768 ? 'h-full' : 'h-0'}`}
              variants={window.innerWidth >= 768 ? slideIn : slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-3 sm:p-4">
                <motion.div 
                  className="flex items-center justify-between mb-3"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-base font-medium">Vehicle Details</h2>
                </motion.div>

                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div 
                      key={selected._id}
                      className="space-y-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div variants={slideUp}>
                        <h3 className="text-base sm:text-lg font-semibold">{selected.name}</h3>
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                          <span>{selected.licensePlate}</span>
                          <span>• {getRelativeTime(selected.timestamp)}</span>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="grid grid-cols-2 gap-3 sm:gap-4"
                        variants={fadeIn}
                      >
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div className="flex items-center gap-1">
                            <motion.div
                              className={`h-2 w-2 rounded-full ${
                                selected.currentStatus === "moving"
                                  ? "bg-green-500"
                                  : selected.currentStatus === "stopped"
                                  ? "bg-yellow-500"
                                  : selected.currentStatus === "inactive"
                                  ? "bg-gray-400"
                                  : "bg-red-500"
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            />
                            <p className="text-sm font-medium">{selected.currentStatus}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Speed</p>
                          <p className="text-sm font-medium">
                            {selected.speed !== undefined ? `${selected.speed} km/h` : "0 km/h"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Battery</p>
                          <div className="flex items-center gap-1">
                            <Battery className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              {selected.extendedData?.vehicleBattery !== undefined
                                ? `${selected.extendedData.vehicleBattery}%`
                                : "0%"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Ignition</p>
                          <p className="text-sm font-medium">
                            {selected.ignition !== undefined
                              ? selected.ignition
                                ? "On"
                                : "Off"
                              : "Off"}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2 pt-1"
                        variants={slideUp}
                      >
                        <h4 className="text-sm font-medium">Map Settings</h4>
                        <div className="space-y-3">
                         
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-geofences" className="text-xs sm:text-sm">Show Geofences</Label>
                            <Switch
                              id="show-geofences"
                              checked={showGeofences}
                              onCheckedChange={setShowGeofences}
                            />
                          </div>
                        
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2 pt-1"
                        variants={slideUp}
                      >
                        <VehicleControls vehicleId={selected._id}/>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="no-selection"
                      className="flex flex-col items-center justify-center py-8 px-4 text-center"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Car className="h-12 w-12 text-muted-foreground mb-4" />
                      </motion.div>
                      <p className="text-muted-foreground text-sm">
                        Select a vehicle to view its details
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button for Mobile - Quick toggle between map and details */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            className="md:hidden fixed bottom-4 right-4 z-10"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Button 
              className="h-12 w-12 rounded-full shadow-lg" 
              onClick={() => setActiveTab(activeTab === 'map' ? 'details' : 'map')}
            >
              {activeTab === 'map' ? (
                <Car className="h-5 w-5" />
              ) : (
                <Locate className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}