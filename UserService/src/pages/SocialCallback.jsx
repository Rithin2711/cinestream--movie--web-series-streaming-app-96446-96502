import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function SocialCallback() {
  /** Handles OAuth provider callback by exchanging code for tokens and redirecting. */
  const navigate = useNavigate();
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const { handleSocialCallback } = React.useContext(AuthContext);
  const [message, setMessage] = useState("Completing social login...");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code) {
      setMessage("Missing code parameter");
      return;
    }
    (async () => {
      try {
        await handleSocialCallback({ provider, code, state });
        navigate("/profile");
      } catch (e) {
        setMessage("Social login failed. Please try again.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h1 className="title">Social Login</h1>
      <div className="card">
        <p>{message}</p>
      </div>
    </div>
  );
}
