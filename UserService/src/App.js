import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import DataProtection from "./pages/DataProtection";
import VerifyOtp from "./pages/VerifyOtp";
import SocialCallback from "./pages/SocialCallback";

// PUBLIC_INTERFACE
export default function App() {
  /** Root application with routes for auth, profile, and privacy. */
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="hero">
                <h1 className="title">CineStream User Portal</h1>
                <p className="subtitle">Manage your account, profile, and privacy</p>
                <div className="actions">
                  <Link className="btn btn-primary" to="/login">Login</Link>
                  <Link className="btn btn-outline" to="/register">Register</Link>
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<PasswordResetRequest />} />
          <Route path="/password/reset" element={<PasswordReset />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/auth/callback/:provider" element={<SocialCallback />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<DataProtection />} />
          <Route
            path="*"
            element={
              <div className="container">
                <h1 className="title">Page not found</h1>
                <p className="muted">The page you are looking for does not exist.</p>
                <Link className="btn btn-secondary" to="/">Go home</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container small">
          <span>© {new Date().getFullYear()} CineStream</span>
        </div>
      </footer>
    </div>
  );
}
