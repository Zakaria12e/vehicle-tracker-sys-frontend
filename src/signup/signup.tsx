"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, MapPin, Lock, Mail, User, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully 🎉");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorMessage = data.error || "Registration failed.";
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error("Fetch error:", err);
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
          <Card className="overflow-hidden p-0 shadow-md">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-4 sm:p-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 sm:gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-xl sm:text-2xl font-bold mb-1">
                      Create an Account
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance max-w-xs">
                      Sign up to start tracking your fleet
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={16}
                        />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-10 pl-10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={16}
                        />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-10 pl-10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building2
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={16}
                        />
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="h-10 pl-10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={16}
                        />
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="h-10 pl-10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer h-10 mt-2 font-medium transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden md:block ">
                <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm mb-4">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/10 dark:bg-blue-500/10 z-0"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative z-10 p-5">
                      <TruckTrackingSVG />
                    </div>
                  </div>

                  <div className="max-w-xs">
                    <h3 className="text-2xl font-bold mb-3">
                      Track Your Fleet
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Real-time GPS tracking and monitoring for your entire
                      truck fleet. Optimize routes and improve efficiency.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Vehicle Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-primary" />
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
