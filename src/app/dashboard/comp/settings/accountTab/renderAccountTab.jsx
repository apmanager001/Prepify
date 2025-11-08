"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Shield, Save } from "lucide-react";
import useForgotPassword from "./useForgotPassword";
import toast from "react-hot-toast";

const RenderAccountTab = ({ email }) => {
  const forgotPasswordMutation = useForgotPassword();

  const handleForgotPassword = async () => {
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      if (error && error.status === 404) {
        toast.error("No user found with that email.");
      } else {
        toast.error("Failed to send password reset email. Please try again.");
      }
    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Security Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Changing your password will log you out of all devices. Make
                sure to remember your new password.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Password reset email will be sent to: <strong>{email}</strong>
        </p>
        <button
          onClick={handleForgotPassword}
          className="btn btn-primary rounded-lg"
        >
          Forgot Password
        </button>
      </div>
    </div>
  );
};

export default RenderAccountTab;
