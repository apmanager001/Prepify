"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        // Store admin status if available
        localStorage.setItem("isAdmin", data.isAdmin || false);
      }
      router.push("/dashboard");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/15 flex items-center justify-center p-4">
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
                  disabled={loginMutation.isPending}
                />
              </label>
            </fieldset>

            {/* Password Field */}
            <fieldset className="fieldset">
              <legend className="label">
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
                  disabled={loginMutation.isPending}
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
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

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
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Forgot your password?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
