"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Lock, AlertTriangle, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ImmobilizeDialogProps {
  vehicleId: string;
  disabled: boolean;
  onSuccess?: () => void; // ✅ callback
}

const API_URL = import.meta.env.VITE_API_URL;

export const ImmobilizeDialog = ({ vehicleId, disabled, onSuccess }: ImmobilizeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isImmobilizing, setIsImmobilizing] = useState(false)
  const [reason, setReason] = useState("")

  const handleImmobilize = async () => {
    if (!vehicleId || !reason) return;

    setIsImmobilizing(true);

    try {
      const res = await fetch(`${API_URL}/immobilizations`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle: vehicleId,
          action: "immobilize",
          reason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Vehicle immobilized successfully!");
        setIsOpen(false);
        setReason("");
        if (onSuccess) onSuccess(); // ✅ trigger refresh
      } else {
        toast.error(data.message || "Failed to immobilize vehicle.");
      }

    } catch (err) {
      console.error("Error immobilizing:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsImmobilizing(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 w-full sm:w-auto" disabled={disabled}>
          <Lock className="h-4 w-4" />
          <span className="whitespace-nowrap">Immobilize</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Vehicle Immobilization</DialogTitle>
          <DialogDescription>
            This will remotely immobilize the selected vehicle. It will not be able to start until reactivated.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for immobilization</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for immobilization..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-24"
            />
          </div>
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-500">Important Safety Notice</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Only immobilize vehicles when they are safely parked. Immobilizing a moving vehicle can be dangerous.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleImmobilize}
            disabled={isImmobilizing || !reason}
            className="gap-1 w-full sm:w-auto"
          >
            {isImmobilizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Immobilizing...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Confirm Immobilization
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
