import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
