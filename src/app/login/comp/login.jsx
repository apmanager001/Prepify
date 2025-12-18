"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User, Key } from "lucide-react";
import useForgotPassword from "@/app/dashboard/comp/settings/accountTab/useForgotPassword";
import toast from "react-hot-toast";
import GoogleButton from "./googleButton";
import { addScoreAndInvalidate } from "@/app/dashboard/comp/dashboardComps/useTotalScore";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const forgotMutation = useForgotPassword();



  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      // store values immediately
      if (data && data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("isAdmin", data.isAdmin || false);
      }

      // Poll profile endpoint to ensure session is visible server-side before redirecting
      (async () => {
        setVerifying(true);
        const maxAttempts = 6;
        let attempt = 0;
        let ok = false;
        let delay = 300;
        while (attempt < maxAttempts) {
          attempt += 1;
          try {
            await api.getProfile();
            ok = true;
            break;
          } catch (err) {
            // wait and retry
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, delay));
            delay = Math.min(2000, Math.floor(delay * 1.5));
          }
        }

        setVerifying(false);
        if (ok) {
          const { status } = await addScoreAndInvalidate("dailyLogin");
          if (status === 201 || status === 214) {
            toast.success("You earned daily login points");
          } 
          router.push("/dashboard");
        } else {
          toast.error(
            "Login succeeded but we couldn't verify your session. Please try again or check server settings."
          );
        }
      })();
    },
    onError: (error) => {
      if (
        error.message.includes("Invalid") ||
        error.message.includes("Incorrect")
      ) {
        setError("Invalid username or password. Please try again.");
      } else if (error.message.includes("Missing")) {
        setError("Please fill in all required fields.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Login failed: ${error.message}`);
      }
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.username.trim()) {
      setError("Please enter your username or email.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }
    loginMutation.mutate(formData);
  };

  // forgot password submit handler
  const handleForgotSubmit = async () => {
    try {
      await forgotMutation.mutateAsync({ email: forgotEmail });
      toast.success("Password reset email sent successfully!");
      setShowForgotModal(false);
    } catch (err) {
      console.error("Forgot password failed", err);
      if (err && err.status === 404) {
        toast.error("No user found with that email.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-primary/10 via-secondary/5 to-primary/15 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
            <GoogleButton />
            <div className="divider divider-primary mb-4">OR</div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <fieldset className="fieldset">
                <legend className="label">
                  <span className="input-group-text text-primary">
                    <User size={18} />
                  </span>
                  <span className="label-text text-base-content font-semibold">
                    Username or Email
                  </span>
                </legend>
                <label className="input w-full">
                  <input
                    id="login-username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username or email"
                    className="grow"
                    required
                    autoComplete="username"
                    disabled={loginMutation.isPending || verifying}
                  />
                </label>
              </fieldset>

              {/* Password Field */}
              <fieldset className="fieldset">
                <legend className="label">
                  <span className="input-group-text text-primary">
                    <Key size={18} />
                  </span>
                  <span className="label-text text-base-content font-semibold">
                    Password
                  </span>
                </legend>
                <label className="input w-full">
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="grow"
                    required
                    autoComplete="current-password"
                    disabled={loginMutation.isPending || verifying}
                  />
                </label>
              </fieldset>

              {/* Error Message */}
              {error && (
                <div className="alert alert-error text-sm">
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full text-lg font-semibold py-3"
                disabled={loginMutation.isPending || verifying}
              >
                {loginMutation.isPending || verifying ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="loading loading-spinner loading-md"></span>
                    <span>{verifying ? "Verifying..." : "Signing in..."}</span>
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Verifying overlay */}
            {verifying && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4">
                  <span className="loading loading-spinner loading-lg"></span>
                  <div>
                    <div className="font-medium">Verifying session</div>
                    <div className="text-sm text-gray-600">
                      Waiting for server to confirm your login...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign up here
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors cursor-pointer"
                >
                  Forgot your password?
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal
        open={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        emailValue={forgotEmail}
        onChange={setForgotEmail}
        onSubmit={handleForgotSubmit}
        loading={forgotMutation.isLoading}
      />
    </>
  );
};

export default Login;

// Forgot Password Modal (rendered at end so it doesn't interrupt layout)
function ForgotPasswordModal({
  open,
  onClose,
  emailValue,
  onChange,
  onSubmit,
  loading,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reset password</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="label">
            <span className="label-text">Email address</span>
          </label>
          <input
            type="email"
            value={emailValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="you@example.com"
            className="input input-bordered w-full"
          />

          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="btn btn-secondary btn-outline">
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className={`btn btn-primary ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send reset email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
