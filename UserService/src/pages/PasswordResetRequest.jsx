import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function PasswordResetRequest() {
  /** Request a password reset via email. */
  const { requestPwdReset, loading, error } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email) {
      setMessage("Enter your email address");
      return;
    }
    try {
      await requestPwdReset({ email });
      setMessage("If the email exists, a reset link has been sent.");
    } catch {
      // handled via context error
    }
  };

  return (
    <div className="container">
      <h1 className="title">Reset your password</h1>
      <p className="subtitle">We'll send a reset link to your email</p>
      <form className="card" onSubmit={submit} aria-label="Password Reset Request">
        {message && <div className="alert">{message}</div>}
        {error && <div className="alert alert-danger">{String(error)}</div>}
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
