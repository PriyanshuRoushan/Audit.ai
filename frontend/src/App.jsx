import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Audit from "./pages/Audit";
import Report from "./pages/Report";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReAudit from "./pages/ReAudit";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", background: "#131313", color: "#e5e2e1", fontFamily: "Inter, sans-serif" }}>
          {/* Injecting styles for Material Symbols */}
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
          <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; line-height: 1; vertical-align: middle; } * { margin: 0; padding: 0; box-sizing: border-box; }`}</style>

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/audit" element={<Audit />} />
            {/* Protected Routes */}
            <Route path="/share/:shareToken" element={<Report />} />
            <Route path="/report/:slug" element={
              <ProtectedRoute redirectTo="/login">
                <Report />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/re-audit/:auditId" element={
              <ProtectedRoute>
                <ReAudit />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;