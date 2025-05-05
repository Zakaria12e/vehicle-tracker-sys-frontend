import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";

import DashboardLayout from "./dashboard/layout";
import DashboardPage from "./dashboard/page";
import VehiclesPage from "./dashboard/vehicles/page";
import TrackingPage from "./dashboard/tracking/page";
import HistoryPage from "./dashboard/history/page";
import ImmobilizationPage from "./dashboard/immobilization/page";
import AlertsPage from "./dashboard/alerts/page";
import StatisticsPage from "./dashboard/statistics/page";
import SettingsPage from "./dashboard/settings/page";
import GeofencingPage from "./dashboard/geofancing/page";
import LoginPage from "./login/login";
import SignupPage from "./signup/signup";
import ForgotPassword from "./login/forgotPassword";
import ResetPassword from "./login/resetPassword";
import "./App.css";
import "leaflet/dist/leaflet.css"
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
              
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/vehicles"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <VehiclesPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/tracking"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <TrackingPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/history"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <HistoryPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/geofencing"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <GeofencingPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/immobilization"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ImmobilizationPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/alerts"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <AlertsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/statistics"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <StatisticsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
