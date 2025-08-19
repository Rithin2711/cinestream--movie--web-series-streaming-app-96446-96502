import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Profile() {
  /** Profile management page to view and update user data. */
  const { user, refreshProfile, updateUserProfile, loading, error } = React.useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ensure we have the latest
    (async () => {
      try {
        await refreshProfile();
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
    });
  }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateUserProfile(form);
      setMessage("Profile updated");
    } catch {
      // error via context
    }
  };

  return (
    <div className="container">
      <h1 className="title">Your profile</h1>
      <p className="subtitle">Manage your account information</p>
      <form className="card" onSubmit={submit} aria-label="Profile Form">
        {message && <div className="alert">{message}</div>}
        {error && <div className="alert alert-danger">{String(error)}</div>}
        <label className="field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <div className="grid two">
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Mobile</span>
            <input name="mobile" type="tel" value={form.mobile} onChange={handleChange} />
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
