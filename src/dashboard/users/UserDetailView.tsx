import {  useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  Phone,
  Activity,
  Settings,
  AlertCircle,
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
         
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                 src={`http://localhost:5000${user?.photo}`}
                alt={user?.name || "User"}
                crossOrigin="anonymous"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
            
                <Badge variant="outline" className="capitalize flex items-center gap-1">
                  {user.role === "admin" && <ShieldCheck className="h-3 w-3 text-yellow-500" />}
                  {user.role === "superadmin" && <ShieldCheck className="h-3 w-3 mr-1 text-purple-600 fill-purple-600" />}
                  {user.role === "user" && <User className="h-3 w-3 mr-1 text-blue-600" />}
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">First Name</label>
                    <p className="text-gray-900 dark:text-white">{user.name.split(" ")[0]}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Name</label>
                    <p className="text-gray-900 dark:text-white">{user.name.split(" ").slice(1).join(" ")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </p>
                  </div>
                  
                </div>
                
          
                

    
              </CardContent>
            </Card>

            {/* Activity & Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity & Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Logins</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Done</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Login IP</span>
                    <span className="text-sm font-medium">{}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Session Duration</span>
                    <span className="text-sm font-medium">{}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                    <span className="text-sm font-medium">{} / {}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

      
          </div>

          {/* Right Column - Quick Info & Settings */}
          <div className="space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Active</span>
                  <span className="text-sm font-medium">
                    {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
                  <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {user.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg">{}</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${}
                    <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Billing</span>
                    <span className="text-sm font-medium">
                      {}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="text-sm font-medium">
                      •••• {}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Billing Status</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View Activity Log
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Suspend Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}