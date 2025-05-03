import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './dashboard/layout'
import DashboardPage from './dashboard/page'
import VehiclesPage from './dashboard/vehicles/page'
import TrackingPage from './dashboard/tracking/page'
import HistoryPage from './dashboard/history/page'
import ImmobilizationPage from './dashboard/immobilization/page'
import AlertsPage from './dashboard/alerts/page'
import StatisticsPage from './dashboard/statistics/page'
import SettingsPage from './dashboard/settings/page'
import GeofencingPage from './dashboard/geofancing/page'
import LoginPage from './login/login'
import SignupPage from './signup/signup'
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"

function  App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/vehicles" element={<DashboardLayout><VehiclesPage /></DashboardLayout>} />
        <Route path="/dashboard/tracking" element={<DashboardLayout><TrackingPage /></DashboardLayout>} />
        <Route path="/dashboard/history" element={<DashboardLayout><HistoryPage /></DashboardLayout>} />
        <Route path="/dashboard/geofencing" element={<DashboardLayout><GeofencingPage /></DashboardLayout>} />
        <Route path="/dashboard/immobilization" element={<DashboardLayout><ImmobilizationPage /></DashboardLayout>} />
        <Route path="/dashboard/alerts" element={<DashboardLayout><AlertsPage /></DashboardLayout>} />
        <Route path="/dashboard/statistics" element={<DashboardLayout><StatisticsPage /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
