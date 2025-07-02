"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Car,
  UserCheck,
  Trash2,
  Circle,
  ArrowRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
  imei: string;
  currentStatus?: string;
}

export default function UserDetailView() {
  const { id: userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vehicleStats, setVehicleStats] = useState<{
    totalVehicles: number;
    movingVehicles: number;
  } | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReassignModal, setShowReassignModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser((res.data as any).data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}/stats`,
          {
            withCredentials: true,
          }
        );
        setVehicleStats(
          (
            res.data as {
              data: { totalVehicles: number; movingVehicles: number };
            }
          ).data
        );
      } catch (err) {
        console.error("Failed to fetch vehicle stats", err);
      }
    };

    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}/vehicles`,
          {
            withCredentials: true,
          }
        );
        setVehicles((res.data as any).data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/non-superadmins`,
          {
            withCredentials: true,
          }
        );
        setUsers((res.data as any).data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (userId) {
      fetchUserDetail();
      fetchStats();
      fetchVehicles();
      fetchUsers();
    }
  }, [userId]);

  const handleReassignVehicle = async () => {
    if (!selectedVehicle || !selectedUser) return;

    setActionLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/vehicles/${
          selectedVehicle._id
        }/reassign`,
        { newUserId: selectedUser },
        { withCredentials: true }
      );

      setVehicles((prev) => prev.filter((v) => v._id !== selectedVehicle._id));
      setReassignDialogOpen(false);
      setSelectedVehicle(null);
      setSelectedUser("");

      if (vehicleStats) {
        setVehicleStats({
          ...vehicleStats,
          totalVehicles: vehicleStats.totalVehicles - 1,
        });
      }
      toast.success("Vehicle reassigned successfully!");
    } catch (error) {
      console.error("Failed to reassign vehicle", error);
      toast.error("Failed to reassign vehicle.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    setActionLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/vehicles/${userId}/vehicles/${
          vehicle._id
        }`,
        {
          withCredentials: true,
        }
      );

      setVehicles((prev) => prev.filter((v) => v._id !== vehicle._id));

      if (vehicleStats) {
        setVehicleStats({
          ...vehicleStats,
          totalVehicles: vehicleStats.totalVehicles - 1,
        });
      }
      toast.success("Vehicle deleted successfully!");
    } catch (error) {
      console.error("Failed to delete vehicle", error);
      toast.error("Failed to delete vehicle.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              User Details
            </h1>
            <p className="text-muted-foreground">
              Manage user profile and assigned vehicles
            </p>
          </div>
        </div>

        {/* User Profile */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`http://localhost:5000${user?.photo}`}
                  alt={user?.name}
                  crossOrigin="anonymous"
                />
                <AvatarFallback className="text-lg font-medium">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <Badge variant="outline" className="capitalize">
                    {user?.role}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Circle
                      className={`h-2 w-2 fill-current ${
                        user?.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground capitalize">
                      {user?.status}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Vehicles
                    </p>
                    <p className="text-2xl font-semibold">
                      {vehicleStats?.totalVehicles || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Vehicles
                    </p>
                    <p className="text-2xl font-semibold">
                      {vehicleStats?.movingVehicles || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(user?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card>
          <CardHeader className="flex items-center justify-between gap-4">
            {/* Left side : Title */}
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Car className="h-5 w-5" />
              Assigned Vehicles
            </CardTitle>

            {/* Right side : Search Bar */}
            <div className="relative w-40 sm:w-60">
              <span className="absolute inset-y-0 left-2 flex items-center text-muted-foreground">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm border rounded focus:outline-none focus:ring focus:border-blue-300 bg-background"
              />
            </div>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No vehicles assigned
                </h3>
                <p className="text-muted-foreground">
                  This user has no vehicles assigned yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Name</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>IMEI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentVehicles.map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell className="font-medium">
                        {vehicle.name}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {vehicle.licensePlate}
                        </code>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {vehicle.imei}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Circle
                            className={`h-2 w-2 fill-current ${
                              vehicle.currentStatus === "moving"
                                ? "text-green-500"
                                : vehicle.currentStatus === "stopped"
                                ? "text-yellow-500"
                                : vehicle.currentStatus === "immobilized"
                                ? "text-red-500"
                                : vehicle.currentStatus === "inactive"
                                ? "text-gray-400"
                                : "text-slate-400"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {vehicle.currentStatus || "unknown"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setShowReassignModal(true);
                            }}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Reassign
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20 bg-red-500/10 text-red-400 border-red-500/20"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Vehicle
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "
                                  {vehicle.name}" from this user? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={actionLoading}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVehicle(vehicle)}
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? "Removing..." : "Remove"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t mt-4">
                <div className="text-xs text-muted-foreground text-center sm:text-left">
                  Showing {startIndex + 1}-{Math.min(endIndex, vehicles.length)}{" "}
                  of {vehicles.length} vehicles
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="h-7 w-7 p-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                    {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 p-0"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showReassignModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 border ">
            <h2 className="text-lg font-semibold mb-2">Reassign Vehicle</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select a user to reassign <strong>{selectedVehicle.name}</strong>{" "}
              to.
            </p>

            <label
              htmlFor="reassign-user"
              className="block text-sm font-medium mb-1"
            >
              Select User
            </label>
            <select
              id="reassign-user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 dark:border-muted bg-white dark:bg-muted px-3 py-2 rounded text-sm focus:outline-none focus:ring"
            >
              <option value="">Choose a user...</option>
              {users
                .filter((u) => u._id !== userId)
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setSelectedVehicle(null);
                  setSelectedUser("");
                }}
                className="px-4 py-2 text-sm rounded bg-muted hover:bg-gray-200 dark:hover:bg-muted-foreground"
              >
                Cancel
              </button>
              <Button
                onClick={handleReassignVehicle}
                disabled={!selectedUser || actionLoading}
                className="px-4 py-2 text-sm"
              >
                {actionLoading ? "Reassigning..." : "Reassign"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
