import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleAlert = (alert: AlertData) => {
      setAlerts((prev) => [alert, ...prev]);

      // Remove after 3 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a !== alert));
      }, 3000);
    };

    socket.on("alert", handleAlert);
    return () => {
      socket.off("alert", handleAlert);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => navigate("/dashboard/alerts")}
        className="relative p-2 rounded-full hover:bg-muted transition"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-bold">
            {alerts.length}
          </span>
        )}
      </button>

      <div className="absolute top-10 right-0 w-64 z-50">
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-2 p-3 rounded-md shadow-lg bg-background dark:bg-background-900 border border-border text-sm"
            >
              <p className="font-semibold">{alert.vehicleName} - {alert.vehiclePlate}</p>
              <p className="text-muted-foreground">{alert.message}</p>
              {alert.location && (
                <p className="text-xs text-muted-foreground mt-1">📍 {alert.location}</p>
              )}
              <p className="text-[10px] mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
