"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Check,
  X,
  Save,
  AtSign,
  Mail,
  FileText,
  BookOpen,
  Calendar,
  Users,
  Globe,
  Link,
  Clock,
  CheckSquare,
  BarChart,
  Play,
  GraduationCap,
  School,
  Clipboard,
} from "lucide-react";
import StudyGoalsTab from "../studyGoalsTab/studyGoalTab";
import { toast } from "react-hot-toast";
import { sendVerificationEmail } from "../../settingsApi";
import { useProfileQuery } from "../../useProfileQuery";

const RenderProfileTab = () => {
  const { data: profileData, isLoading, isError } = useProfileQuery();
  const [userData, setUserData] = useState({
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      bio: "Passionate student focused on academic excellence",
      // avatar: null,
      createdAt: null,
    },
  });

  React.useEffect(() => {
    if (profileData) {
      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData,
          publicProfile:
            profileData.publicProfile ?? prev.profile.publicProfile,
          createdAt: profileData.createdAt || prev.profile.createdAt,
        },
      }));
    }
  }, [profileData]);

  const handleInputChange = (section, field, value) => {
    setUserData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };


 

  const handleSave = async (section = "profile") => {
    // prepare payload to send to backend
    console.log(`Saving ${section} settings:`, userData[section]);
    const payload = {
      ...userData.profile,
      // ensure availability and arrays are normalized
      subjects: Array.isArray(userData.profile.subjects)
        ? userData.profile.subjects
        : [],
      studyGoals: Array.isArray(userData.profile.studyGoals)
        ? userData.profile.studyGoals
        : [],
      availability: {
        weekdays: !!userData.profile.availability?.weekdays,
        weekends: !!userData.profile.availability?.weekends,
        timesOfDay: Array.isArray(userData.profile.availability?.timesOfDay)
          ? userData.profile.availability.timesOfDay
          : [],
      },
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Status ${res.status}`);
      }
      const body = await res.json().catch(() => ({}));
      toast.success("Profile saved");
      // update local state with server canonical data
      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...body.profile,
        },
      }));
    } catch (err) {
      console.error("Failed to save profile", err);
      toast.error("Failed to save profile");
    }
  };

  // const handleAvatarChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // TODO: Implement file upload to backend
  //     console.log("Avatar file selected:", file);
  //     // Update avatar preview
  //   }
  // };
  return (
    <div className="space-y-6">
      {/* Profile completion indicator */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              {userData.profile.avatar ? (
                <img
                  src={userData.profile.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={48} className="text-primary" />
              )}
            </div>
            {/* <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label> */}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Picture
            </h3>
            {/* <p className="text-sm text-gray-600">Upload a new profile picture</p> */}
            {userData.profile.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                Created On:{" "}
                {new Date(userData.profile.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            )}
          </div>
        </div>
        {/* <div className="flex items-center space-x-3">
          <div className="w-12 h-12 relative">
            <svg viewBox="0 0 36 36" className="w-12 h-12">
              <path
                d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray={`${computeCompletion()} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Profile</div>
            <div className="text-xs text-gray-500">
              {computeCompletion()}% complete
            </div>
          </div>
        </div> */}
      </div>

      {/* Loading/Error States */}
      {isLoading && <div className="text-gray-500">Loading profile...</div>}
      {isError && <div className="text-red-500">Error loading profile.</div>}

      {/* Responsive 3-column form grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>First Name</span>
            </div>
          </label>
          <input
            type="text"
            className="input w-full"
            value={userData.profile.firstName || ""}
            onChange={(e) =>
              handleInputChange("profile", "firstName", e.target.value)
            }
            disabled={isLoading}
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Last Name</span>
            </div>
          </label>
          <input
            type="text"
            className="input w-full"
            value={userData.profile.lastName || ""}
            onChange={(e) =>
              handleInputChange("profile", "lastName", e.target.value)
            }
            disabled={isLoading}
            autoComplete="family-name"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <AtSign size={16} />
              <span>Username</span>
            </div>
          </label>
          <input
            id="username"
            type="text"
            value={userData.profile.username}
            onChange={(e) =>
              handleInputChange("profile", "username", e.target.value)
            }
            className="input"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>Email</span>
            </div>
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="email"
              type="email"
              value={userData.profile.email}
              onChange={(e) =>
                handleInputChange("profile", "email", e.target.value)
              }
              className="input flex-1"
              disabled={isLoading}
              autoComplete="off"
            />

            <div className="flex items-center space-x-2">
              {userData.profile.emailVerified ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <X size={18} className="text-red-500" />
              )}

              <button
                type="button"
                onClick={async () => {
                  if (!userData.profile.email) {
                    toast.error("No email available to verify.");
                    return;
                  }
                  try {
                    await sendVerificationEmail(userData.profile.email);
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
                disabled={isLoading || userData.profile.emailVerified}
                className={`btn btn-primary rounded-xl btn-sm text-sm font-medium transition-colors ${
                  userData.profile.emailVerified
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {userData.profile.emailVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>Bio</span>
            </div>
          </label>
          <textarea
            id="bio"
            value={userData.profile.bio || ""}
            onChange={(e) =>
              handleInputChange("profile", "bio", e.target.value)
            }
            rows={3}
            className="textarea w-full h-32"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        <div className="lg:col-span-3 flex justify-end">
          <button
            onClick={() => handleSave("profile")}
            className="bg-primary text-white btn btn-primary rounded-xl font-extrabold transition-colors"
            disabled={isLoading}
          >
            <span>Save Study Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenderProfileTab;
