import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function VerifyOtp() {
  /** Optional dedicated OTP verification page for mobile login flows. */
  const navigate = useNavigate();
  const { verifyOtp, loading, error } = React.useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [otp, setOtp] = useState(searchParams.get("otp") || "");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!mobile || !otp) {
      setMessage("Provide mobile and OTP");
      return;
    }
    try {
      await verifyOtp({ mobile, otp });
      navigate("/profile");
    } catch {
      // context error
    }
  };

  return (
    <div className="container">
      <h1 className="title">Verify OTP</h1>
      <form className="card" onSubmit={submit}>
        {message && <div className="alert">{message}</div>}
        {error && <div className="alert alert-danger">{String(error)}</div>}
        <label className="field">
          <span>Mobile</span>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 555 123 4567" />
        </label>
        <label className="field">
          <span>OTP</span>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
        </label>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
