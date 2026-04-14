"use client";

import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    try {
      if (window.opener) {
        window.opener.postMessage(
          { type: "oauth_success" },
          window.location.origin,
        );
      }
    } catch (error) {
      console.error("OAuth success callback failed:", error);
    }

    const timeoutId = window.setTimeout(() => {
      try {
        window.close();
      } catch (error) {
        console.error("Failed to close OAuth popup:", error);
      }
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Authentication successful</h2>
        <p className="mt-2 text-sm text-gray-600">
          You can close this window. Sign-in will continue in the original tab.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              try {
                window.close();
              } catch (error) {
                console.error("Failed to close OAuth popup:", error);
              }
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
