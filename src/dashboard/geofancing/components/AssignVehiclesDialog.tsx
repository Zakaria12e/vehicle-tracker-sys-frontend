import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
}

interface AssignVehiclesDialogProps {
  open: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  selectedZoneId: string | null;
  initiallyAssigned: string[];
  apiUrl: string;
  onSuccess?: () => void;
}

export default function AssignVehiclesDialog({
  open,
  onClose,
  vehicles,
  selectedZoneId,
  initiallyAssigned,
  apiUrl,
  onSuccess,
}: AssignVehiclesDialogProps) {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (open) {
      setSelectedVehicles(initiallyAssigned);
      timer = setTimeout(() => setShowContent(true), 50);
    } else {
      setShowContent(false);
    }

    return () => clearTimeout(timer);
  }, [open, initiallyAssigned]);

  const handleChange = (vehicleId: string, checked: boolean) => {
    setSelectedVehicles((prev) =>
      checked ? [...prev, vehicleId] : prev.filter((id) => id !== vehicleId)
    );
  };

  const handleSubmit = async () => {
    if (!selectedZoneId) return;

    try {
      const res = await fetch(`${apiUrl}/geofences/${selectedZoneId}/vehicles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ vehicles: selectedVehicles }),
      });

      if (res.ok) {
        toast.success("Vehicles assigned successfully");
        onClose();
        onSuccess?.();
      } else {
        const data = await res.json();
        toast.error(data.message || "Assignment failed");
      }
    } catch (error) {
      toast.error("Connection error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {showContent && (
        <DialogContent className="w-[95vw] max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Assign Vehicles to Zone</DialogTitle>
            <DialogDescription>Select vehicles to assign to this geofence.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-60 overflow-y-auto mt-2">
            {vehicles.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No vehicles available
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`veh-${vehicle._id}`}
                    checked={selectedVehicles.includes(vehicle._id)}
                    onChange={(e) => handleChange(vehicle._id, e.target.checked)}
                  />
                  <label htmlFor={`veh-${vehicle._id}`} className="text-sm truncate">
                    {vehicle.name} – {vehicle.licensePlate}
                  </label>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button className="w-full md:w-auto" onClick={handleSubmit}>
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
