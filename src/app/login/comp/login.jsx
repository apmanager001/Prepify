"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log("🔍 Login attempt with credentials:", credentials);
      console.log("🔍 API Base URL:", process.env.NEXT_PUBLIC_BACKEND);

      try {
        const response = await api.login(credentials);
        console.log("✅ Login API response:", response);
        return response;
      } catch (error) {
        console.error("❌ Login API error:", error);
        console.error("❌ Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("🎉 Login successful:", data);
      setDebugInfo(`Login successful! User ID: ${data.userId}`);

      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        console.log("💾 User data stored in localStorage");
      }

      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("💥 Login mutation error:", error);
      setDebugInfo(`Error: ${error.message}`);

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
    if (debugInfo) setDebugInfo("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted with data:", formData);
    setDebugInfo("Form submitted, attempting login...");

    // Client-side validation
    if (!formData.username.trim()) {
      setError("Please enter your username or email.");
      setDebugInfo("Validation failed: missing username");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      setDebugInfo("Validation failed: missing password");
      return;
    }

    console.log("✅ Validation passed, calling login mutation");
    loginMutation.mutate(formData);
  };

  // Test function to check API connectivity
  const testAPI = async () => {
    setDebugInfo("Testing API connectivity...");

    // Check environment variable
    console.log("🔍 Environment check:");
    console.log("NEXT_PUBLIC_BACKEND:", process.env.NEXT_PUBLIC_BACKEND);
    console.log("NODE_ENV:", process.env.NODE_ENV);

    if (!process.env.NEXT_PUBLIC_BACKEND) {
      setDebugInfo("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "test", password: "test" }),
      });

      console.log("🔍 Test API response status:", response.status);
      console.log("🔍 Test API response headers:", response.headers);

      const data = await response.text();
      console.log("🔍 Test API response body:", data);

      setDebugInfo(`API test completed. Status: ${response.status}`);
    } catch (error) {
      console.error("❌ API test failed:", error);
      setDebugInfo(`API test failed: ${error.message}`);
    }
  };

  // Check environment on component mount
  React.useEffect(() => {
    console.log("🔍 Component mounted - Environment check:");
    console.log("NEXT_PUBLIC_BACKEND:", process.env.NEXT_PUBLIC_BACKEND);

    if (!process.env.NEXT_PUBLIC_BACKEND) {
      setDebugInfo("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
    } else {
      setDebugInfo(`✅ API URL configured: ${process.env.NEXT_PUBLIC_BACKEND}`);
    }
  }, []);

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

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
          <p className="text-sm text-blue-700">
            {debugInfo || "No debug info yet"}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            API URL: {process.env.NEXT_PUBLIC_BACKEND || "Not set"}
          </p>
          <button
            onClick={testAPI}
            className="mt-2 text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
          >
            Test API
          </button>
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
