"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User, Key } from "lucide-react";
import useForgotPassword from "@/app/dashboard/comp/settings/accountTab/useForgotPassword";
import toast from "react-hot-toast";
import GoogleButton from "./googleButton";
import { addScoreAndInvalidate } from "@/app/dashboard/comp/dashboardComps/useTotalScore";

const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const awardDailyLoginScore = async () => {
    try {
      const { status } = await addScoreAndInvalidate("dailyLogin");

      if (status === 201 || status === 214) {
        toast.success("You earned daily login points");
      }
    } catch (scoreError) {
      console.warn("Failed to award daily login score:", scoreError);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.login(credentials);
      return response;
    },
    onSuccess: async () => {
      setError("");
      setVerifying(true);

      const profile = await api.waitForProfile();

      setVerifying(false);

      if (!profile) {
        const message =
          "Login succeeded but we couldn't verify your session. Please try again.";

        setError(message);
        toast.error(message);
        return;
      }

      queryClient.setQueryData(["profile"], profile);
      router.replace("/dashboard");
      void awardDailyLoginScore();
    },
    onError: (error) => {
      setError(getLoginErrorMessage(error));
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
      <div className="md:min-h-screen flex items-center justify-center md:p-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="bg-base-100 md:bg-white/80 backdrop-blur-xl md:rounded-3xl border border-white/30 shadow-2xl p-8 min-h-screen md:min-h-0">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue your learning journey
              </p>
            </div>
            <GoogleButton />
            <div className="divider divider-primary mb-4">OR</div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend label text-primary text-lg">
                  <User />
                  Username or Email
                </legend>
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username or email"
                  className="input input-xl w-full bg-white"
                  required
                  autoComplete="username"
                  disabled={loginMutation.isPending || verifying}
                />
              </fieldset>

              {/* Password Field */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend label text-primary text-lg">
                  <Key />
                  Password
                </legend>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="input input-xl w-full bg-white"
                  required
                  autoComplete="current-password"
                  disabled={loginMutation.isPending || verifying}
                />
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
                className="btn btn-primary w-full text-lg font-semibold"
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
        loading={forgotMutation.isPending}
      />
    </>
  );
};

export default Login;

function getLoginErrorMessage(error) {
  const rawMessage = typeof error?.message === "string" ? error.message : "";
  const message = rawMessage.toLowerCase();

  if (
    error?.status === 401 ||
    message.includes("incorrect") ||
    message.includes("invalid")
  ) {
    return "Invalid username or password. Please try again.";
  }

  if (error?.status === 400 || message.includes("missing")) {
    return "Please fill in all required fields.";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }

  if (rawMessage) {
    return `Login failed: ${rawMessage}`;
  }

  return "Login failed. Please try again.";
}

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

        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend label text-primary text-lg">
              Email address
            </legend>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder="you@example.com"
              className="input input-xl w-full"
            />
          </fieldset>
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
