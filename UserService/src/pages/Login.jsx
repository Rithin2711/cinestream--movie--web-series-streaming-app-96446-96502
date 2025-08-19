import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getSocialLoginUrl } from "../api/client";

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page for email/password and mobile OTP with optional social logins. */
  const navigate = useNavigate();
  const { loginEmail, startOtpLogin, verifyOtp, loading, error } = React.useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const OAUTH_GOOGLE = String(process.env.REACT_APP_OAUTH_GOOGLE_ENABLED || "false") === "true";
  const OAUTH_GITHUB = String(process.env.REACT_APP_OAUTH_GITHUB_ENABLED || "false") === "true";
  const OTP_ENABLED = String(process.env.REACT_APP_OTP_LOGIN_ENABLED || "false") === "true";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }
    try {
      await loginEmail({ email, password });
      navigate("/profile");
    } catch {
      // error handled by context state
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile) {
      setMessage("Please enter a mobile number");
      return;
    }
    try {
      await startOtpLogin({ mobile });
      setOtpSent(true);
      setMessage("OTP sent to your mobile");
    } catch {
      // error handled by context
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!mobile || !otp) {
      setMessage("Enter mobile and OTP");
      return;
    }
    try {
      await verifyOtp({ mobile, otp });
      navigate("/profile");
    } catch {
      // error handled by context
    }
  };

  const startSocial = (provider) => {
    const url = getSocialLoginUrl(provider);
    window.location.href = url;
  };

  return (
    <div className="container">
      <h1 className="title">Welcome back</h1>
      <p className="subtitle">Log in to your CineStream account</p>

      <div className="grid">
        <form className="card" onSubmit={handleEmailLogin} aria-label="Email Login">
          <h2>Email login</h2>
          {message && <div className="alert">{message}</div>}
          {error && <div className="alert alert-danger">{String(error)}</div>}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="muted">
            <Link to="/password/forgot">Forgot password?</Link>
          </div>
        </form>

        <div className="card">
          <h2>Mobile OTP</h2>
          {!OTP_ENABLED && <p className="muted">OTP login is currently disabled.</p>}
          {OTP_ENABLED && (
            <>
              <label className="field">
                <span>Mobile</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </label>
              {otpSent && (
                <label className="field">
                  <span>OTP</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                </label>
              )}
              {!otpSent ? (
                <button className="btn btn-secondary" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              )}
            </>
          )}
        </div>

        <div className="card">
          <h2>Social login</h2>
          <p className="muted">Use your social account</p>
          <div className="social-buttons">
            {OAUTH_GOOGLE && (
              <button className="btn btn-google" onClick={() => startSocial("google")}>
                Continue with Google
              </button>
            )}
            {OAUTH_GITHUB && (
              <button className="btn btn-github" onClick={() => startSocial("github")}>
                Continue with GitHub
              </button>
            )}
            {!OAUTH_GOOGLE && !OAUTH_GITHUB && (
              <p className="muted">No social providers enabled.</p>
            )}
          </div>
          <div className="muted">
            New here? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
