import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * GoogleButton
 * Opens the backend /google route in a popup to start OAuth.
 * After the popup completes, it confirms the session via /profile and invokes
 * onSuccess with the user data if provided.
 */
const GoogleButton = ({ onSuccess } = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const openPopupAndWait = (url, name = "google_oauth", options = {}) => {
    const width = options.width || 600;
    const height = options.height || 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      name,
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) return Promise.reject(new Error("Popup blocked"));

    const allowedOrigins = new Set([window.location.origin]);

    try {
      allowedOrigins.add(new URL(url).origin);
    } catch (error) {}

    return new Promise((resolve, reject) => {
      let settled = false;
      let profileUser = null;

      const closePopup = () => {
        try {
          if (!popup.closed) {
            popup.close();
          }
        } catch (error) {}
      };

      const finish = (callback) => {
        if (settled) return;
        settled = true;
        cleanup();
        callback();
      };

      const cleanup = () => {
        try {
          window.removeEventListener("message", onMessage);
        } catch (error) {}
        try {
          clearTimeout(timeoutId);
        } catch (error) {}
        try {
          clearInterval(pollId);
        } catch (error) {}
      };

      const onMessage = (event) => {
        try {
          if (event.source && event.source !== popup) return;
        } catch (error) {}

        if (!allowedOrigins.has(event.origin)) return;

        const data = event.data || {};

        if (data.type === "oauth_success") {
          finish(() => {
            closePopup();

            resolve({ success: true, reason: "message", user: profileUser || data.user });
          });
        }

        if (data.type === "oauth_error") {
          finish(() => {
            closePopup();

            reject(
              new Error(
                typeof data.message === "string"
                  ? data.message
                  : "Google sign-in failed",
              ),
            );
          });
        }
      };

      window.addEventListener("message", onMessage);

      const sessionPromise = (async () => {
        let attempt = 0;
        let delay = options.initialDelay || 250;
        const maxAttempts = options.maxAttempts || 30;

        while (!settled && attempt < maxAttempts) {
          attempt += 1;

          try {
            const user = await api.getProfile();

            if (!settled) {
              profileUser = user;
              try {
                popup.location.href = "/auth/success";
              } catch (_e) {}
              await wait(3000);
              finish(() => {
                closePopup();
                resolve({ success: true, reason: "profile", user });
              });
            }
            return;
          } catch (error) {
            if (settled || attempt === maxAttempts) {
              return;
            }

            // eslint-disable-next-line no-await-in-loop
            await wait(delay);
            delay = Math.min(1500, Math.floor(delay * 1.35));
          }
        }
      })();

      const pollId = setInterval(() => {
        if (!popup.closed) {
          try {
            const popupUrl = new URL(popup.location.href);

            if (
              allowedOrigins.has(popupUrl.origin) &&
              popupUrl.pathname === "/dashboard"
            ) {
              finish(() => {
                closePopup();

                resolve({
                  success: true,
                  reason: "navigation",
                  path: popupUrl.pathname,
                });
              });
            }
          } catch (error) {}

          return;
        }

        finish(() => {
          resolve({ success: false, reason: "closed" });
        });
      }, 300);

      const timeoutId = setTimeout(() => {
        finish(() => {
          closePopup();

          resolve({ success: false, reason: "timeout" });
        });
      }, 60000);

      void sessionPromise;
    });
  };

  const [pending, setPending] = useState(false);

  const handleLogin = async () => {
    setPending(true);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND || "";

      if (!base) {
        throw new Error(
          "Backend API URL not configured. Please check your environment variables.",
        );
      }

      const authUrl = `${base}/google`;
      const result = await openPopupAndWait(authUrl, "google_oauth", {
        maxAttempts: 200,
        initialDelay: 100,
      });

      const user =
        result.user ||
        (await api.waitForProfile({
          maxAttempts: 8,
          initialDelay: 350,
        }));

      if (!user) {
        console.warn("Google login not confirmed by backend", result);

        if (result.reason === "timeout") {
          toast.error(
            "Google sign-in timed out before your session was confirmed. Please try again.",
          );
        } else if (result.reason === "closed") {
          toast.error(
            "Google sign-in window closed before your session was confirmed. Please try again.",
          );
        } else {
          toast.error(
            "Google sign-in completed, but we couldn't verify your session. Please try again.",
          );
        }

        return;
      }

      queryClient.setQueryData(["profile"], user);
      if (onSuccess) onSuccess(user);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);

      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <fieldset className="fieldset">
      <button
        onClick={handleLogin}
        className="btn bg-white text-black border-[#e5e5e5] hover:bg-base-200 hover:border-gray-300 hover:scale-105 transition-transform duration-100"
        type="button"
        disabled={pending}
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
        {pending ? (
          <span className="flex items-center space-x-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span>Signing in...</span>
          </span>
        ) : (
          "Login with Google"
        )}
      </button>
    </fieldset>
  );
};

export default GoogleButton;
