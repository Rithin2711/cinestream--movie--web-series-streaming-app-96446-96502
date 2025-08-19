import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function PasswordReset() {
  /** Set a new password using a token received via email. */
  const { resetPwd, loading, error } = React.useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!pwd || pwd.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }
    if (pwd !== pwd2) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await resetPwd({ token, new_password: pwd });
      setMessage("Password has been reset. You may now log in.");
    } catch {
      // error shown via context
    }
  };

  return (
    <div className="container">
      <h1 className="title">Choose a new password</h1>
      <form className="card" onSubmit={submit} aria-label="Password Reset">
        {message && <div className="alert">{message}</div>}
        {error && <div className="alert alert-danger">{String(error)}</div>}
        <label className="field">
          <span>New Password</span>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" />
        </label>
        <label className="field">
          <span>Confirm Password</span>
          <input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} placeholder="••••••••" />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}
