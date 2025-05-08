import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Locate, Lock, Battery, AlertTriangle, Car } from "lucide-react";
import { toast } from "sonner";
import VehicleMap from "@/components/VehicleMap";
import getRelativeTime from "@/components/relativeTime";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

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

export default function TrackingPage() {
  const { imei } = useParams();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState(imei || "all");
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showGeofences, setShowGeofences] = useState(true);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'details'>('map');

  const handleLocateClick = () => {
    setTriggerZoom(true);
    setTimeout(() => setTriggerZoom(false), 1000);
  };

  const selected =
    selectedVehicle === "all"
      ? null
      : vehicles.find((v) => v.imei === selectedVehicle);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Set details as active tab when a vehicle is selected on mobile
  useEffect(() => {
    if (selected && window.innerWidth < 768) {
      setActiveTab('details');
    }
  }, [selectedVehicle]);

  const fetchVehicles = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/vehicles`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        const processed = data.data.vehicles.map((v: any) => {
          const telemetry = v.telemetry || {};
          let status = v.currentStatus;

          if (status !== "immobilized") {
            if (!telemetry.ignition || telemetry.vehicleBattery === 0) {
              status = "inactive";
            } else if (telemetry.speed === 0) {
              status = "stopped";
            } else {
              status = "moving";
            }
          }

          const lat = telemetry.lat ?? 0;
          const lon = telemetry.lon ?? 0;

          return {
            ...v,
            currentStatus: status,
            lat,
            lon,
            telemetry,
          };
        });

        setVehicles(processed);
      } else {
        toast.error("Failed to load vehicles");
      }
    } catch (err) {
      toast.error("Unable to connect to vehicle service");
    }
  };

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
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="h-9 text-sm w-full sm:w-[220px]">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v._id} value={v.imei}>
                  {v.name} ({v.licensePlate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  devices={vehicles.filter((v) => v.lat !== 0 && v.lon !== 0)}
                  selectedVehicle={selectedVehicle}
                  triggerZoom={triggerZoom}
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
                          <span>• {getRelativeTime(selected.telemetry.timestamp)}</span>
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
                            {selected.telemetry.speed} km/h
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Battery</p>
                          <div className="flex items-center gap-1">
                            <Battery className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-sm font-medium">{selected.telemetry.vehicleBattery}%</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Ignition</p>
                          <p className="text-sm font-medium">
                            {selected.telemetry.ignition ? "On" : "Off"}
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
                            <Label htmlFor="show-traffic" className="text-xs sm:text-sm">Show Traffic</Label>
                            <Switch
                              id="show-traffic"
                              checked={showTraffic}
                              onCheckedChange={setShowTraffic}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-geofences" className="text-xs sm:text-sm">Show Geofences</Label>
                            <Switch
                              id="show-geofences"
                              checked={showGeofences}
                              onCheckedChange={setShowGeofences}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label htmlFor="refresh-interval" className="text-xs sm:text-sm">Refresh Interval</Label>
                              <span className="text-xs text-muted-foreground">
                                {refreshInterval}s
                              </span>
                            </div>
                            <Slider
                              id="refresh-interval"
                              min={1}
                              max={30}
                              step={1}
                              value={[refreshInterval]}
                              onValueChange={(val) => setRefreshInterval(val[0])}
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2 pt-1"
                        variants={slideUp}
                      >
                        <h4 className="text-sm font-medium">Vehicle Controls</h4>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 flex-1 h-8 text-xs sm:text-sm"
                          >
                            <Lock className="h-3 w-3" />
                            Immobilize
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 flex-1 h-8 text-xs sm:text-sm"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Alert Driver
                          </Button>
                        </div>
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