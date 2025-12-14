"use client";
import React, { useState } from "react";
import { Shield, Save, AtSign, Mail, X, Check } from "lucide-react";
import useForgotPassword, { useChangeEmail } from "./useForgotPassword";
import { sendVerificationEmail } from "../../settingsApi";
import toast from "react-hot-toast";
import { useProfileQuery } from "../../useProfileQuery";
import { useQueryClient } from "@tanstack/react-query";
import LoadingComp from "@/lib/loading";

const RenderAccountTab = () => {
  const { data: profileData, isLoading, isError } = useProfileQuery();
  const queryClient = useQueryClient();
  const forgotPasswordMutation = useForgotPassword();
  const changeEmailMutation = useChangeEmail();
  const email = profileData?.email || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const displayUsername = profileData?.username?.startsWith("\\google")
    ? "Logged in with Google"
    : profileData?.username;

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

  const handleChangeEmail = () => {
    setIsModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmChangeEmail = async () => {
    try {
      await changeEmailMutation.mutateAsync({ newEmail });
      toast.success(
        "Email change initiated. Check your inbox for verification."
      );
      setIsConfirmModalOpen(false);
      setNewEmail("");
      // Invalidate profile to refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.error("Change email error", error);
      let errorMessage = "Failed to change email.";
      if (error.status === 400) {
        errorMessage = "Email not provided or Email is already being used.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500 min-h-24 flex items-center justify-center">
        <LoadingComp />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-base-200 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="shrink-0">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              <AtSign size={16} />
              <span>Username</span>
            </div>
          </label>
          <p className="text-xs text-gray-500 ml-4">
            Login only, can not change
          </p>
          <input
            id="username"
            type="text"
            value={displayUsername}
            // onChange={(e) =>
            //   handleInputChange("profile", "username", e.target.value)
            // }
            className="input w-full"
            disabled={true}
            autoComplete="off"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 "
          >
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>Email</span>
            </div>
          </label>
          <p className="text-xs text-gray-500 ml-4">
            Changing your email, will change your login email.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <input
              id="email"
              type="email"
              value={profileData?.email}
              onChange={(e) =>
                handleInputChange("profile", "email", e.target.value)
              }
              className="input flex-1 w-full bg-base-100"
              disabled={isLoading}
              autoComplete="off"
            />

            <div className="flex items-center space-x-2">
              {profileData?.emailVerified ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <X size={18} className="text-red-500" />
              )}

              <button
                type="button"
                onClick={async () => {
                  if (!profileData?.email) {
                    toast.error("No email available to verify.");
                    return;
                  }
                  try {
                    await sendVerificationEmail(profileData.email);
                    toast.success("Verification email sent. Check your inbox.");
                  } catch (err) {
                    console.error("sendVerificationEmail error", err);
                    const msg =
                      err?.body?.message ||
                      err?.message ||
                      "Failed to send verification email.";
                    toast.error(msg);
                  }
                }}
                disabled={isLoading || profileData?.emailVerified}
                className={`btn btn-primary rounded-xl btn-sm text-sm font-medium transition-colors ${
                  profileData?.emailVerified
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {profileData?.emailVerified ? "Verified" : "Verify"}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-secondary rounded-xl btn-sm text-sm font-medium"
              >
                Change Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {email && (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Password reset email will be sent to: <strong>{email}</strong>
          </p>
          <button
            onClick={handleForgotPassword}
            className="btn btn-primary rounded-lg"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Reset Password"}
          </button>
        </div>
      )}

      <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Change Email</h3>
          <p className="py-4">Enter your new email address.</p>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="input input-bordered w-full"
            placeholder="New email address"
          />
          <div className="modal-action">
            <button className="btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleChangeEmail}>
              Change
            </button>
          </div>
        </div>
      </div>

      <div className={`modal ${isConfirmModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Email Change</h3>
          <p className="py-4">
            Are you sure you want to change your email to{" "}
            <strong>{newEmail}</strong>?
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleConfirmChangeEmail}
              disabled={changeEmailMutation.isPending}
            >
              {changeEmailMutation.isPending ? "Changing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderAccountTab;
