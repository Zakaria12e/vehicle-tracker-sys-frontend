import { Button } from "@/components/ui/button"
import { Lock, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom";

interface VehicleControlsProps {
 vehicleId: string;
}

export function VehicleControls({ vehicleId}: VehicleControlsProps) {
  const navigate = useNavigate();

  const handleImmobilizeClick = () => {
    navigate(`/dashboard/immobilization?vehicle=${vehicleId}`);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Vehicle Controls</h4>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 flex-1"
          onClick={handleImmobilizeClick}
         
        >
          <Lock className="h-3 w-3" />
          Immobilize
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1 flex-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Alert Driver
        </Button>
      </div>
    </div>
  );
}
