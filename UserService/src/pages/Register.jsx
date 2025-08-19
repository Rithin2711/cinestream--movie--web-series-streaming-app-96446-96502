import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration page supporting email or mobile-based accounts. */
  const navigate = useNavigate();
  const { register, loading, error } = React.useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [policy, setPolicy] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!policy) {
      setMessage("You must accept the Privacy Policy and Terms.");
      return;
    }
    if (!password || (!email && !mobile)) {
      setMessage("Provide email or mobile and a password.");
      return;
    }
    try {
      await register({ name, email: email || undefined, mobile: mobile || undefined, password });
      navigate("/profile");
    } catch {
      // error displayed via context
    }
  };

  return (
    <div className="container">
      <h1 className="title">Create your account</h1>
      <p className="subtitle">Start watching the latest movies and shows</p>

      <form className="card" onSubmit={handleRegister} aria-label="Registration Form">
        {message && <div className="alert">{message}</div>}
        {error && <div className="alert alert-danger">{String(error)}</div>}
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </label>
        <div className="grid two">
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span>Mobile</span>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 555 123 4567" />
          </label>
        </div>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
          <span>I accept the <Link to="/privacy">Privacy Policy</Link> and Terms.</span>
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <div className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
