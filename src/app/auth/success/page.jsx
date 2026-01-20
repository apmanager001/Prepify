"use client";
import React, { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    // Notify opener window that auth succeeded
    try {
      const redirectUrl = "/dashboard";
      // If opened as a popup from the main app, notify the opener so it can handle navigation.
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "oauth_success", url: redirectUrl },
          window.location.origin,
        );
        // Give the opener a moment to handle the message, then close the popup.
        const t = setTimeout(() => {
          try {
            window.close();
          } catch (e) {}
        }, 300);
        return () => clearTimeout(t);
      }

      // No opener (or it closed) — redirect this window to the dashboard.
      window.location.href = redirectUrl;
    } catch (e) {
      console.error("Error notifying opener window:", e);
      try {
        window.location.href = "/dashboard";
      } catch (err) {}
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Authentication successful</h2>
        <p className="mt-2 text-sm text-gray-600">
          You can close this window — you will be redirected shortly.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              try {
                window.close();
              } catch (e) {}
            }}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
