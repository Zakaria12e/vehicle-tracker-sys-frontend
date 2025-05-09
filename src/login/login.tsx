"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
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
    <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div
          className={cn("flex flex-col gap-4 sm:gap-6", className)}
          {...props}
        >
          <Card className="overflow-hidden p-0 shadow-md border-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-5 sm:p-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col items-center text-center mb-2">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-sm text-balance mt-1">
                      Login to your account to continue
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-2.5 text-gray-400">
                          <Mail size={16} />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-10 pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </Label>
                        <Link
                          to="/forgot-password"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-2.5 text-gray-400">
                          <Lock size={16} />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-10 pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 mt-2 font-medium"
                    disabled={loading}
                  >
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
                        Login <ArrowRight size={16} className="ml-1" />
                      </div>
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/signup"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>

              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
                <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm mb-4">
                    <span className="absolute inset-0 rounded-full zoom-animate bg-primary/10 dark:bg-blue-500/10 z-0" />
                    <div className="relative z-10 p-5">
                      <TruckTrackingSVG />
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-xl font-bold mb-3">Fleet Management</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Access your dashboard to monitor your fleet in real-time.
                      Optimize routes and improve efficiency.
                    </p>
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>Vehicle Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Real-time GPS</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TruckTrackingSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <circle cx="120" cy="120" r="80" fill="currentColor" fillOpacity="0.05" />
      <circle
        cx="120"
        cy="120"
        r="60"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="2"
      />
      <path
        d="M60 100H180"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <path
        d="M60 140H180"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <path
        d="M100 60V180"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <path
        d="M140 60V180"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <rect
        x="85"
        y="110"
        width="70"
        height="30"
        rx="2"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="75"
        y="120"
        width="30"
        height="20"
        rx="1"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="155"
        y="115"
        width="20"
        height="25"
        rx="2"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="159"
        y="119"
        width="12"
        height="8"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="90"
        cy="145"
        r="8"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="90"
        cy="145"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="160"
        cy="145"
        r="8"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="160"
        cy="145"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="120" cy="125" r="4" fill="currentColor" />
      <path d="M120 125L140 105" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M120 100C131 100 140 109 140 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M120 90C137 90 150 104 150 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M120 80C142 80 160 98 160 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M60 160C80 140 100 180 120 160C140 140 160 180 180 160"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <circle
        cx="120"
        cy="160"
        r="6"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="120" cy="160" r="2" fill="currentColor" />
    </svg>
  );
}
