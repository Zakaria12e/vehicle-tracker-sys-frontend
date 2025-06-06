import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useAuth } from "@/context/AuthContext"; // to get current user
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Eye,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Crown,
  MoreHorizontal,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get<{ data: User[] }>(`${API_URL}/users`, { withCredentials: true })
      .then((res) => setUsers(res.data.data))
      .catch(console.error);
  }, [API_URL]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const res = await axios.patch(
        `${API_URL}/users/${userId}/status`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      const updatedUser = (res.data as { data: User }).data;
      setUsers(users.map((user) => (user._id === userId ? updatedUser : user)));
    } catch (err) {
      console.error("Error changing status", err);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user._id !== userId));
  };

  const canModify = () => {
    if (!currentUser) return false;
    // Only superadmin can promote or demote users
    return currentUser.role === "superadmin";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRoleChange = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "user" ? "admin" : "user";

      const res = await axios.patch(
        `${API_URL}/users/${userId}/role`,
        {
          role: newRole,
        },
        { withCredentials: true }
      );

      const updatedUser = (res.data as { data: User }).data;
      setUsers(users.map((user) => (user._id === userId ? updatedUser : user)));
    } catch (err) {
      console.error("Error updating role", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage users and their permissions
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adjusting table for mobile responsiveness, adding role icon beside the name, and displaying email under the name */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs text-muted-foreground sm:text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-0">
                        <div className="block sm:hidden">
                          {user.role === "superadmin" ? (
                            <Crown className="h-4 w-4 text-purple-500" />
                          ) : user.role === "admin" ? (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <User className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground hidden sm:table-cell">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge
                        className={`capitalize px-2 py-1 border text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {user.lastActive
                        ? formatDistanceToNow(new Date(user.lastActive), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 capitalize hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {user.role === "superadmin" ? (
                          <Crown className="h-4 w-4 text-purple-500" />
                        ) : user.role === "admin" ? (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <User className="h-4 w-4 text-blue-500" />
                        )}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link
                              to={`/dashboard/users/${user._id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!canModify()}
                            onClick={() => handleRoleChange(user._id, user.role)}
                            className="cursor-pointer"
                          >
                            {user.role === "user" ? (
                              <>
                                <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                                Promote to Admin
                              </>
                            ) : user.role === "admin" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4 text-blue-500" />
                                Demote to User
                              </>
                            ) : (
                              <>
                                <Edit className="mr-2 h-4 w-4" />
                                Not Editable
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={!canModify()}
                            onClick={() =>
                              handleStatusChange(
                                user._id,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" /> Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" /> Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                disabled={!canModify()}
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete the user account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm self-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
