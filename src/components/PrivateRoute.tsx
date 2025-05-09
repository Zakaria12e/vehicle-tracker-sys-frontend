import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { useAuth } from "@/context/AuthContext";
import VehicleLoader from "./vehicle-loader";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <VehicleLoader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
