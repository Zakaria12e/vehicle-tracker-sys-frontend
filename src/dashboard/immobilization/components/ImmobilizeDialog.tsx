"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lock, AlertTriangle, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ImmobilizeDialogProps {
  disabled: boolean;
}

export const ImmobilizeDialog = ({ disabled }: ImmobilizeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isImmobilizing, setIsImmobilizing] = useState(false)
  const [reason, setReason] = useState("")

  const handleImmobilize = () => {
    setIsImmobilizing(true)
    setTimeout(() => {
      setIsImmobilizing(false)
      setIsOpen(false)
      setReason("")
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1" disabled={disabled}>
          <Lock className="h-4 w-4" />
          Immobilize
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Vehicle Immobilization</DialogTitle>
          <DialogDescription>
            This will remotely immobilize the selected vehicle. The vehicle will not be able to start until you
            remove the immobilization.
          </DialogDescription>
        </DialogHeader>
        {/* Rest of dialog content */}
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for immobilization</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for immobilization..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-500">Important Safety Notice</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Only immobilize vehicles when they are safely parked. Immobilizing a moving vehicle can be
                  dangerous.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImmobilize} disabled={isImmobilizing || !reason} className="gap-1">
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
