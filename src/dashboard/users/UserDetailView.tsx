import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  ShieldCheck,
  CreditCard,
  Car,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Shield,
  Crown,
} from "lucide-react";

export default function UserDetailView() {
  const { id: userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
          withCredentials: true,
        });
        setUser((res.data as any).data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserDetail();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black-500 dark:border-white-500 border-t-transparent"></div>
          <p className=" font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case "admin":
        return <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
      case "admin":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl shadow-sm">
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border">
              <AvatarImage
               src={`http://localhost:5000${user?.photo}`}
                alt={user?.name || "User"}
                crossOrigin="anonymous"
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover"
              />
              <AvatarFallback className="text-xl font-bold capitalize">
                {user?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center ${
                user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {user.status === 'active' ? (
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                ) : (
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h1>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-3">{user.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                <Badge className={`capitalize flex items-center gap-2 px-3 py-1 font-medium ${getRoleBadgeColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </Badge>
                <Badge className={`flex items-center gap-2 px-3 py-1 font-medium ${
                  user.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                }`}>
                  {user.status === 'active' ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Cars Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-medium uppercase tracking-wide mb-1">Total Cars</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{user.totalCars || 0}</p>
                  <p className="text-blue-400 dark:text-blue-500 text-xs sm:text-sm mt-1">All registered vehicles</p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/20 backdrop-blur-sm rounded-2xl">
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-blue-300/10 dark:bg-blue-900/10 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-blue-300/5 dark:bg-blue-900/5 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Active Cars Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-medium uppercase tracking-wide mb-1">Active Cars</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{user.activeCars || 0}</p>
                  <p className="text-emerald-400 dark:text-emerald-500 text-xs sm:text-sm mt-1">Currently operational</p>
                </div>
                <div className="p-3 sm:p-4 bg-emerald-100 dark:bg-emerald-900/20 backdrop-blur-sm rounded-2xl">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-300" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-emerald-300/10 dark:bg-emerald-900/10 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-300/5 dark:bg-emerald-900/5 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Total Alerts Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 dark:text-amber-300 text-xs sm:text-sm font-medium uppercase tracking-wide mb-1">Total Alerts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{user.totalAlerts || 0}</p>
                  <p className="text-amber-400 dark:text-amber-500 text-xs sm:text-sm mt-1">System notifications</p>
                </div>
                <div className="p-3 sm:p-4 bg-amber-100 dark:bg-amber-900/20 backdrop-blur-sm rounded-2xl">
                  <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-300" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-amber-300/10 dark:bg-amber-900/10 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-amber-300/5 dark:bg-amber-900/5 rounded-full"></div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Account Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl">
                    <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Member Since</p>
                      <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl">
                    <div className="p-2 sm:p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Last Active</p>
                      <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Information */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="text-center p-4 sm:p-6 bg-black text-white rounded-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg sm:text-xl mb-2">Premium</h3>
                    <p className="text-2xl sm:text-3xl font-bold mb-1">
                      $29.99
                      <span className="text-base sm:text-lg font-normal">/month</span>
                    </p>
                    <p className="text-xs sm:text-sm">Full access to all features</p>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full"></div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Next Billing</span>
                    <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">July 4, 2025</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Payment Method</span>
                    <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">•••• 1234</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Billing Status</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}