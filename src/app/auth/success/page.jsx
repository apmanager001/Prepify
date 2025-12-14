"use client";
import React, { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    // Notify opener window that auth succeeded
    try {
      if (window.opener) {
        window.opener.postMessage(
          { type: "oauth_success" },
          window.location.origin
        );
      }
    } catch (e) {
      // ignore
    }

    // Close the popup shortly after notifying the opener
    const t = setTimeout(() => {
      try {
        window.close();
      } catch (e) {}
    }, 800);

    return () => clearTimeout(t);
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
