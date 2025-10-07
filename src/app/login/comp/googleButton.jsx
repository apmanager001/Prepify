import React from "react";
import { api } from "@/lib/api";

/**
 * GoogleButton
 * Opens the backend /google route in a popup to start OAuth.
 * After the popup completes, it calls `api.getCurrentUser()` and invokes
 * onSuccess with the user data if provided.
 */
const GoogleButton = ({ onSuccess } = {}) => {
  const openPopupAndWait = (url, name = "google_oauth", options = {}) => {
    const width = options.width || 600;
    const height = options.height || 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      name,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) return Promise.reject(new Error("Popup blocked"));

    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        try {
          // If popup closed, stop polling
          if (popup.closed) {
            clearInterval(timer);
            reject(new Error("Popup closed before completing authentication"));
            return;
          }

          // If the popup has navigated to the same origin, we can detect success.
          // We'll look for an URL containing `/auth/success` or similar — since
          // your backend uses `/googleCallback` we expect it to eventually redirect
          // to a frontend route or to a page we can inspect. If backend sets a
          // cookie session, simply closing the popup may be enough and we'll
          // call getCurrentUser after popup closes.
          const url = popup.location.href;
          if (url && (url.includes("/auth/success") || url.includes("/googleCallback"))) {
            clearInterval(timer);
            try {
              popup.close();
            } catch (e) {}
            resolve({ success: true });
          }
        } catch (err) {
          // Cross-origin access will throw while the popup is on the provider's domain;
          // ignore until it redirects back to our origin or closes.
        }
      }, 500);
    });
  };

  const handleLogin = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND || "";
      const authUrl = `${base}/google`;
      await openPopupAndWait(authUrl);

      // After popup completes, fetch current user from backend (cookies included)
      const user = await api.getCurrentUser();
      if (onSuccess) onSuccess(user);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <fieldset className="fieldset">
      <button
        onClick={handleLogin}
        className="btn bg-white text-black border-[#e5e5e5]"
        type="button"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </fieldset>
  );
};

export default GoogleButton;