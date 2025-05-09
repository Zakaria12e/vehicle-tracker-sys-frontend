import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
    <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 md:p-6">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0 shadow-md">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-4 sm:p-6 md:p-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-xl sm:text-2xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground text-sm sm:text-base text-balance">
                      Sign up to start tracking your fleet
                    </p>
                  </div>
                  
                  {/* On mobile, stack fields vertically */}
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div className="grid gap-2 sm:gap-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="grid gap-2 sm:gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div className="grid gap-2 sm:gap-3">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="grid gap-2 sm:gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer h-10 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Log in
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden md:flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
                <div className="relative z-20 flex flex-col items-center justify-center gap-6 text-center">
                  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-slate-200/50 dark:bg-slate-700/50 p-6">
                    <TruckTrackingSVG />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Track Your Fleet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Real-time GPS tracking and monitoring for your entire
                      truck fleet. Optimize routes and improve efficiency.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Truck className="h-4 w-4" />
                      <span>Vehicle Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>Real-time GPS</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground text-center text-xs text-balance">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a> and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
          </div>
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
      className="text-slate-700 dark:text-blue-700"
    >
      {/* Background Elements */}
      <circle cx="120" cy="120" r="80" fill="currentColor" fillOpacity="0.05" />
      <circle
        cx="120"
        cy="120"
        r="60"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="2"
      />

      {/* Map Grid */}
      <path
        d="M60 100H180"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      {/* Wheels */}
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

      {/* GPS Signal */}
      <circle cx="120" cy="125" r="4" fill="currentColor" />
      <path d="M120 125L140 105" stroke="currentColor" strokeWidth="1.5" />

      {/* GPS Waves */}
      <path
        d="M120 100C131.046 100 140 108.954 140 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M120 90C136.569 90 150 103.431 150 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M120 80C142.091 80 160 97.9086 160 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Route Path */}
      <path
        d="M60 160C80 140 100 180 120 160C140 140 160 180 180 160"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 2"
      />

      {/* Location Pin */}
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