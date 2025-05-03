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
      const response = await fetch("http://localhost:5000/api/v1/auth/register", {
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
    <div className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground text-balance">
                      Sign up to start tracking your fleet
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <Button className="mt-8 w-full gap-3 cursor-pointer">
                    <GoogleLogo />
                    Continue with Google
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Log in
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden md:flex flex-col items-center justify-center p-8">
                <div className="absolute inset-0 bg-card z-10"></div>
                <div className="relative z-20 flex flex-col items-center justify-center gap-6 text-center">
                  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-slate-200/50 dark:bg-slate-700/50 p-6">
                    <TruckTrackingSVG />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Track Your Fleet</h3>
                    <p className="text-muted-600 dark:text-mute-400 text-sm max-w-xs">
                      Real-time GPS tracking and monitoring for your entire
                      truck fleet. Optimize routes and improve efficiency.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
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
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
const GoogleLogo = () => (
  <svg
    width="1.2em"
    height="1.2em"
    id="icon-google"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 align-sub text-[inherit] size-lg"
  >
    {" "}
    <g clipPath="url(#clip0)">
      {" "}
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      ></path>{" "}
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      ></path>{" "}
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      ></path>{" "}
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      ></path>{" "}
    </g>{" "}
    <defs>
      {" "}
      <clipPath id="clip0">
        {" "}
        <rect width="15.6825" height="16" fill="white"></rect>{" "}
      </clipPath>{" "}
    </defs>{" "}
  </svg>
);

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
