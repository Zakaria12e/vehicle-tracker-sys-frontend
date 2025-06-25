"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, MapPin, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      const meRes = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });

      const meData = await meRes.json();
      if (meData.success) {
        setUser(meData.data);
        toast.success("Logged in successfully 🎉");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6 md:flex-row", className)} {...props}>
          <Card className="w-full md:w-1/2 shadow-md border-0">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                 <div className="flex items-center justify-center gap-2">
  <h1 className="text-2xl font-bold">Welcome Back</h1>
  <img src="/hello.png" alt="Welcome Back" className="h-8 w-8 object-contain" />
</div>

                  <p className="text-muted-foreground text-sm">
                    Login to manage your fleet in real-time
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-10 pl-9 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-10 pl-9 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      Login <ArrowRight size={16} />
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Right Side Image Section */}
          <div className="relative hidden md:flex w-1/2 items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-40"></div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Light Mode Image */}
              <img
                src="/car-gps-black.png"
                alt="Fleet Light"
                className="block dark:hidden w-44 h-44 object-contain mb-4"
              />

              {/* Dark Mode Image */}
              <img
                src="/car-gps-white.png"
                alt="Fleet Dark"
                className="hidden dark:block w-44 h-44 object-contain mb-4"
              />

              <h3 className="text-xl font-bold">Fleet Management</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Monitor your vehicles in real-time, get alerts,
                and optimize routes.
              </p>

              <div className="flex gap-4 mt-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Real-time GPS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
