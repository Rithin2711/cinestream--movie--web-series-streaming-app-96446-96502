import React from "react";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function BackButton({ label = "Go Back", className = "btn btn-outline", to = "/" }) {
  /**
   * A reusable back button that navigates to the previous page using React Router.
   * If there is no history entry to go back to, it navigates to the provided 'to' fallback (default "/").
   *
   * Props:
   * - label: Text to display on the button (default: "Go Back")
   * - className: CSS classes applied to the button (default: "btn btn-outline")
   * - to: Fallback path if history back isn't available (default: "/")
   */
  const navigate = useNavigate();

  const onClick = React.useCallback(() => {
    // React Router v6 stores a history index on window.history.state.idx (in browsers)
    try {
      const state = window.history.state || {};
      const idx = typeof state.idx === "number" ? state.idx : 0;
      if (idx > 0) {
        navigate(-1);
      } else {
        navigate(to, { replace: true });
      }
    } catch {
      navigate(to, { replace: true });
    }
  }, [navigate, to]);

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label="Go back to the previous page"
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
}
