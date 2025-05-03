import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    MoreHorizontal,
    Pencil,
    MapPin,
    Clock,
    Trash2,
    ArrowUpRight,
    Battery,
  } from "lucide-react";
  
  // Status color mapping
  const statusColor: Record<string, string> = {
    moving: "bg-green-500",
    stopped: "bg-yellow-500",
    immobilized: "bg-blue-500",
    inactive: "bg-red-500",
  };
  
  type VehicleCardProps = {
    name: string;
    licensePlate: string;
    status: "moving" | "stopped" | "immobilized" | "inactive";
    speed: number;
    battery: number;
  };
  
  export function VehicleCard({
    name,
    licensePlate,
    status,
    battery,
  }: VehicleCardProps) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="mr-2 h-4 w-4" />
                  Track
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>
            {licensePlate} • exemple: Last updated just now
          </CardDescription>
        </CardHeader>
  
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 pl-2 rounded-full ${
                  statusColor[status] || "bg-gray-400"
                }`}
              />
              <span className="capitalize">{status}</span>
            </div>
            <div className="flex items-center gap-1">
             
            </div>
            <div className="flex items-center gap-1">
              <Battery className="h-4 w-4 text-muted-foreground" />
              <span>{battery}%</span>
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full gap-1">
            <ArrowUpRight className="h-3 w-3" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  }
  