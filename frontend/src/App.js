import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Pages
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import WebsiteMonitorUI from "./components/WebsiteMonitorUI";
import AlertsPage from "./components/AlertsPage";
import UptimePage from "./components/UptimePage";
import ApiMonitoringPage from "./components/ApiMonitoringPage";
import AnalyticsPage from "./components/AnalyticsPage";
import PipelinesPage from "./components/PipelinesPage";
import LogsPage from "./components/LogsPage";
import ContainersPage from "./components/ContainersPage";
import DeploymentsPage from "./components/DeploymentsPage";
import DashboardHome from "./components/DashboardHome";
import SecurityPage from "./components/SecurityPage";
import IncidentsPage from "./components/IncidentsPage";
import NotFound from "./components/Common/NotFound";
import Docs from "./pages/Docs";
import "./index.css";

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setUser(!!savedToken);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setUser(true);
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 28, height: 28, border: "2px solid #1f1f1f", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Login onLogin={handleLogin} />} />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={user ? <DashboardHome /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/websites"
        element={user ? <WebsiteMonitorUI /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/alerts"
        element={user ? <AlertsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/uptime"
        element={user ? <UptimePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/analytics"
        element={user ? <AnalyticsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/pipelines"
        element={user ? <PipelinesPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/logs"
        element={user ? <LogsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/containers"
        element={user ? <ContainersPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/api-monitoring"
        element={user ? <ApiMonitoringPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/deployments"
        element={user ? <DeploymentsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/security"
        element={user ? <SecurityPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/incidents"
        element={user ? <IncidentsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/settings"
        element={user ? <WebsiteMonitorUI /> : <Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
