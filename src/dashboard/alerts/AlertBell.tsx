import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alertCount, setAlertCount] = useState<number>(user?.alertCounter || 0);
  const [visibleAlerts, setVisibleAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    const handleAlert = (alert: AlertData) => {
      setAlertCount((prev) => prev + 1);
      setVisibleAlerts((prev) => [alert, ...prev]);

      setTimeout(() => {
        setVisibleAlerts((prev) => prev.filter((a) => a !== alert));
      }, 6000);
    };

    socket.on("alert", handleAlert);
    return () => {
      socket.off("alert", handleAlert);
    };
  }, []);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleClick = async () => {
    try {
      await axios.post(`${API_URL}/users/reset-alert-counter`, {}, { withCredentials: true });
      setAlertCount(0);
      navigate("/dashboard/alerts");
    } catch (err) {
      console.error('Failed to reset alert counter:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative p-2 rounded-full hover:bg-muted transition cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-bold">
            {alertCount}
          </span>
        )}
      </button>

      <div className="absolute top-10 right-0 w-64 z-50">
        <AnimatePresence>
          {visibleAlerts.map((alert, i) => (
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
