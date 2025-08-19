"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Use the API utility for registration
  const registerUser = async (userData) => {
    return api.register(userData);
  };

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      // Store user data in localStorage if needed
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
      }
      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      // Handle different error types based on your API response
      if (error.message.includes("already in use")) {
        if (error.message.includes("username")) {
          setError("Username is already taken. Please choose a different one.");
        } else if (error.message.includes("Email")) {
          setError(
            "Email is already registered. Please use a different email or try logging in."
          );
        } else {
          setError("Account already exists. Please try logging in instead.");
        }
      } else if (error.message.includes("Missing")) {
        setError("Please fill in all required fields.");
      } else if (
        error.message.includes("too long") ||
        error.message.includes("too short")
      ) {
        setError("Please check the length requirements for your input fields.");
      } else {
        setError("Registration failed. Please try again later.");
      }
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Basic validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.username.length > 20) {
      setError("Username must be 20 characters or less");
      return;
    }

    const { confirmPassword, ...userData } = formData;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl border border-primary/20">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center text-primary mb-6">
              Create Account
            </h2>

            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <fieldset className="fieldset">
                <legend className="label">
                  <span className="input-group-text text-primary">
                    <User size={18} />
                  </span>
                  <span className="label-text text-base-content font-semibold">
                    Username
                  </span>
                </legend>
                <label className="input w-full">
                  <input
                    id="register-username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className=""
                    required
                    autoComplete="username"
                    disabled={registerMutation.isPending}
                    maxLength={20}
                  />
                </label>
              </fieldset>

              {/* Email Field */}
              <fieldset className="fieldset">
                <legend className="label">
                  <span className="input-group-text text-primary">
                    <Mail size={18} />
                  </span>
                  <span className="label-text text-base-content font-semibold">
                    Email
                  </span>
                </legend>
                <label className="input w-full">
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className=""
                    required
                    autoComplete="email"
                    disabled={registerMutation.isPending}
                  />
                </label>
              </fieldset>

              {/* Password Field */}
              <fieldset className="fieldset">
                <legend className="label">
                  <span className="input-group-text text-primary">
                    <Lock size={18} />
                  </span>
                  <span className="label-text text-base-content font-semibold">
                    Password
                  </span>
                </legend>
                <label className="input w-full">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className=""
                    required
                    disabled={registerMutation.isPending}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn text-primary bg-transparent border-none"
                    disabled={registerMutation.isPending}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>
              </fieldset>

              {/* Confirm Password Field */}
              <fieldset className="fieldset">
                <legend className="label">
                  <span className="input-group-text text-primary">
                    <Lock size={18} />
                  </span>
                  <span className="label-text text-base-content font-semibold">
                    Confirm Password
                  </span>
                </legend>
                <label className="input w-full">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className=""
                    required
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn text-primary bg-transparent border-none"
                    disabled={registerMutation.isPending}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </label>
              </fieldset>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="btn btn-primary w-full"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Already have an account?{" "}
                <a href="/login" className="link link-primary font-semibold">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
