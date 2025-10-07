"use client";
import React, { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    // Notify opener window that auth succeeded and close the popup
    try {
      if (window.opener) {
        window.opener.postMessage({ type: "oauth_success" }, window.origin);
      }
    } catch (e) {
      // ignore cross-origin errors
    }

    // Close the popup after a short delay to allow opener to receive message
    const t = setTimeout(() => {
      try {
        window.close();
      } catch (e) {}
    }, 500);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Authentication successful</h2>
        <p className="mt-2">You can close this window.</p>
      </div>
    </div>
  );
}
