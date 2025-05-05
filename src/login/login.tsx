import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();


  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      const meRes = await fetch("http://localhost:5000/api/v1/auth/me", {
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
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your account
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <Button className="mt-8 w-full gap-3 cursor-pointer">
                    <GoogleLogo /> Continue with Google
                  </Button>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
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
                      Real-time GPS tracking and monitoring for your entire truck
                      fleet. Optimize routes and improve efficiency.
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
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
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
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 align-sub text-[inherit]"
  >
    <g clipPath="url(#clip0)">
      <path d="M15.68 8.18a8 8 0 00-.14-1.62H8v3.06h4.68A4.01 4.01 0 018 12a4.58 4.58 0 01-4.3-3.07H0v1.92A8 8 0 008 16c2.3 0 4.23-.76 5.65-2.06L13.3 12a7.94 7.94 0 002.38-3.82h-.01z" fill="#4285F4" />
      <path d="M8 3.17a4.3 4.3 0 013.03 1.18l2.26-2.26A7.97 7.97 0 008 0a8 8 0 00-7.14 4.5L3.5 6.5A4.58 4.58 0 018 3.17z" fill="#EA4335" />
      <path d="M.86 4.5A7.97 7.97 0 000 8c0 1.22.29 2.37.86 3.5l2.64-2.04A4.6 4.6 0 013.5 6.5L.86 4.5z" fill="#FBBC05" />
      <path d="M8 16a8 8 0 005.66-2.06l-2.65-2.05A4.58 4.58 0 018 12a4.58 4.58 0 01-4.3-3.07L.86 11.5A8 8 0 008 16z" fill="#34A853" />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
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
      <circle cx="120" cy="120" r="80" fill="currentColor" fillOpacity="0.05" />
      <circle cx="120" cy="120" r="60" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
      <path d="M60 100H180" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <path d="M60 140H180" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <path d="M100 60V180" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <path d="M140 60V180" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <rect x="85" y="110" width="70" height="30" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="75" y="120" width="30" height="20" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <rect x="155" y="115" width="20" height="25" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <rect x="159" y="119" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="90" cy="145" r="8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <circle cx="90" cy="145" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="160" cy="145" r="8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <circle cx="160" cy="145" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="120" cy="125" r="4" fill="currentColor" />
      <path d="M120 125L140 105" stroke="currentColor" strokeWidth="1.5" />
      <path d="M120 100C131 100 140 109 140 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M120 90C137 90 150 104 150 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M120 80C142 80 160 98 160 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 160C80 140 100 180 120 160C140 140 160 180 180 160" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="120" cy="160" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="120" cy="160" r="2" fill="currentColor" />
    </svg>
  );
}
