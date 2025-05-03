import { Button } from "@/components/ui/button"
import { Lock, AlertTriangle } from "lucide-react"

interface VehicleControlsProps {
  onImmobilize: () => void;
  onAlert: () => void;
  disabled?: boolean;
}

export function VehicleControls({ onImmobilize, onAlert, disabled }: VehicleControlsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Vehicle Controls</h4>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 flex-1" 
          onClick={onImmobilize}
          disabled={disabled}
        >
          <Lock className="h-3 w-3" />
          Immobilize
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 flex-1" 
          onClick={onAlert}
          disabled={disabled}
        >
          <AlertTriangle className="h-3 w-3" />
          Alert Driver
        </Button>
      </div>
    </div>
  )
}
