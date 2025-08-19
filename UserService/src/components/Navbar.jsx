import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme }) {
  /** The main navigation bar for CineStream UserService. */
  const { user, logout } = React.useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">CineStream</Link>
        <NavLink to="/privacy" className="navlink">Privacy</NavLink>
        {user && <NavLink to="/profile" className="navlink">Profile</NavLink>}
      </div>
      <div className="navbar-right">
        <button
          className="btn btn-secondary"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {!user ? (
          <>
            <NavLink to="/login" className="btn">Login</NavLink>
            <NavLink to="/register" className="btn btn-outline">Register</NavLink>
          </>
        ) : (
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
