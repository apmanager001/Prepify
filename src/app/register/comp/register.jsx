"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import GoogleButton from "../../login/comp/googleButton";

const Register = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Use the API utility for registration
  const registerUser = async (userData) => {
    return api.register(userData);
  };

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      setError("");
      setVerifying(true);

      const profile = await api.waitForProfile();

      setVerifying(false);

      if (!profile) {
        const message =
          "Account created, but we couldn't verify your session yet. Please use the sign-in link below if needed.";

        setError(message);
        toast.error(message);
        return;
      }

      queryClient.setQueryData(["profile"], profile);
      router.replace("/dashboard");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      setError(getRegisterErrorMessage(error));
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
    <div className="min-h-screen bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center md:p-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 md:bg-white/80 backdrop-blur-xl md:rounded-3xl border border-white/30 shadow-2xl p-8 min-h-screen md:min-h-0">
          <div className="text-center mb-8 p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>

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
            <GoogleButton />
            <div className="divider divider-primary mb-4">OR</div>
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Username Field */}
              <fieldset className="fieldset text-left">
                <legend className="fieldset-legend label text-primary text-lg">
                  <User />
                  Username
                </legend>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="input input-xl w-full bg-white"
                  required
                  autoComplete="username"
                  disabled={registerMutation.isPending || verifying}
                  maxLength={20}
                />
              </fieldset>

              {/* Email Field */}
              <fieldset className="fieldset text-left">
                <legend className="fieldset-legend label text-primary text-lg">
                  <Mail />
                  Email
                </legend>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="input input-xl w-full bg-white"
                  required
                  autoComplete="email"
                  disabled={registerMutation.isPending || verifying}
                />
              </fieldset>

              {/* Password Field */}
              <fieldset className="fieldset text-left">
                <legend className="fieldset-legend label text-primary text-lg">
                  <Lock />
                  Password
                </legend>
                <label className="input input-xl w-full bg-white">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className=""
                    required
                    disabled={registerMutation.isPending || verifying}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost text-primary bg-transparent border-none"
                    disabled={registerMutation.isPending || verifying}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>
              </fieldset>

              {/* Confirm Password Field */}
              <fieldset className="fieldset text-left">
                <legend className="fieldset-legend label text-primary text-lg">
                  <Lock />
                  Confirm Password
                </legend>
                <label className="input input-xl w-full bg-white">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className=""
                    required
                    disabled={registerMutation.isPending || verifying}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn btn-ghost text-primary bg-transparent border-none"
                    disabled={registerMutation.isPending || verifying}
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
                  disabled={registerMutation.isPending || verifying}
                  className="btn btn-primary text-lg w-full"
                >
                  {registerMutation.isPending || verifying ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {verifying
                        ? "Verifying session..."
                        : "Creating Account..."}
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

        {verifying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4">
              <span className="loading loading-spinner loading-lg"></span>
              <div>
                <div className="font-medium">Verifying session</div>
                <div className="text-sm text-gray-600">
                  Waiting for server to confirm your new account...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;

function getRegisterErrorMessage(error) {
  const rawMessage = typeof error?.message === "string" ? error.message : "";
  const message = rawMessage.toLowerCase();

  if (error?.status === 409 || message.includes("already in use")) {
    if (message.includes("username")) {
      return "Username is already taken. Please choose a different one.";
    }

    if (message.includes("email")) {
      return "Email is already registered. Please use a different email or try logging in.";
    }

    return "Account already exists. Please try logging in instead.";
  }

  if (error?.status === 400 || message.includes("missing")) {
    return "Please fill in all required fields.";
  }

  if (
    message.includes("too long") ||
    message.includes("too short") ||
    message.includes("at least")
  ) {
    return (
      rawMessage ||
      "Please check the length requirements for your input fields."
    );
  }

  if (rawMessage) {
    return rawMessage;
  }

  return "Registration failed. Please try again later.";
}
