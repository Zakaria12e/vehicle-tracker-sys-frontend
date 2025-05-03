import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, AlertTriangle, CheckCircle2 } from "lucide-react"

export const ImmobilizationGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Immobilization Guide</CardTitle>
        <CardDescription>Important information about vehicle immobilization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">How It Works</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Immobilization sends a command to the vehicle's tracker that prevents the engine from starting.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/50">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">Safety Precautions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Only immobilize vehicles when they are safely parked to prevent accidents or hazards.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/50">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Best Practices</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Always document the reason for immobilization and notify relevant personnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
