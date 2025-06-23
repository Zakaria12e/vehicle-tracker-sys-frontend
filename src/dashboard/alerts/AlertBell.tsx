import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});

interface AlertData {
  vehicleId: string;
  vehicleName?: string;
  vehiclePlate?: string;
  type: string;
  message: string;
  location?: string;
  timestamp: string;
}

export default function AlertBell() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleAlert = (alert: AlertData) => {
      setAlerts(prev => [alert, ...prev]);
    };

    socket.on("alert", handleAlert);

    return () => {
      socket.off("alert", handleAlert);
    };
  }, []);

  const removeAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-bold">
              {alerts.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 sm:w-80 p-2  bg-background dark:bg-background-900">
        <p className="text-sm font-semibold mb-2">Recent Alerts</p>
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              No active alerts.
            </motion.p>
          ) : (
            alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-start justify-between gap-2 p-2 border rounded-md bg-background dark:bg-background-900/10"
              >
                <div className="flex-1 text-xs">
                  <p className="font-semibold">{alert.vehicleName} - {alert.vehiclePlate}</p>
                  <p className="text-muted-foreground">{alert.message}</p>
                  <p className="text-[10px] mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                  {alert.location && <p className="text-[10px]">📍 {alert.location}</p>}
                </div>
                <button onClick={() => removeAlert(i)}>
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
