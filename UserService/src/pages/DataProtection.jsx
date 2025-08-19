import React from "react";

// PUBLIC_INTERFACE
export default function DataProtection() {
  /** Privacy and data protection page informing users and listing options. */
  return (
    <div className="container">
      <h1 className="title">Privacy & Data Protection</h1>
      <p className="subtitle">Your privacy matters at CineStream</p>

      <div className="card">
        <p>
          CineStream collects only the data required to provide a secure and personalized streaming
          experience. We never sell your data. You control your information at any time.
        </p>
        <ul className="list">
          <li>Access your personal data from your Profile page.</li>
          <li>Request export or deletion by contacting support.</li>
          <li>Manage communication preferences in your account settings.</li>
        </ul>
        <p className="muted">
          For more information, email privacy@cinestream.example or view our full policy in the Legal
          section.
        </p>
      </div>
    </div>
  );
}
