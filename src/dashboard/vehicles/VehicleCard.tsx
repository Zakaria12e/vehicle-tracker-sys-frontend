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
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
  } from "@/components/ui/dialog";
  import {
    MoreHorizontal,
    Pencil,
    MapPin,
    Clock,
    Trash2,
    ArrowUpRight,
    Battery,
  } from "lucide-react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import  getRelativeTime  from "@/components/relativeTime";
  // Status color mapping
  const statusColor: Record<string, string> = {
    moving: "bg-green-500",
    stopped: "bg-yellow-500",
    immobilized: "bg-red-500",
    inactive: "bg-gray-500",
  };
  
  type VehicleCardProps = {
    id: string;
    imei: string;
    name: string;
    licensePlate: string;
    status: "moving" | "stopped" | "immobilized" | "inactive";
    speed: number;
    battery: number;
    timestamp: string;
    onDelete?: (id: string) => void;
  };
  

  
  export function VehicleCard({
    id,
    imei,
    name,
    licensePlate,
    status,
    battery,
    timestamp,
    onDelete,
  }: VehicleCardProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
      setDeleting(true);
      try {
        const res = await fetch(`http://localhost:5000/api/v1/vehicles/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete vehicle.");
        }
        onDelete?.(id);
        setOpenDialog(false);
      } catch (err) {
        console.error(err);
        alert("Failed to delete vehicle.");
      } finally {
        setDeleting(false);
      }
    };

    const handleTrack = () => {
      navigate(`/track/${imei}`); // Pass the IMEI to the track page
    };

    return (
      <>
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
                  <DropdownMenuItem onClick={handleTrack}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Track
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Clock className="mr-2 h-4 w-4" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setOpenDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>
              {licensePlate} • Updated {getRelativeTime(timestamp)}
            </CardDescription>
          </CardHeader>
    
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 pl-2 rounded-full ${
                    statusColor[status] || "bg-gray-400"
                  }`}
                />
                <span className="capitalize">{status}</span>
              </div>
              <div className="flex items-center gap-1" />
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
    
        {/* DELETE DIALOG - Moved inside the return block */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Vehicle</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
    
  }
