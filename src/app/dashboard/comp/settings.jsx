"use client";

import React, { useState } from "react";
import { useProfileQuery } from "./useProfileQuery";
import { sendVerificationEmail } from "./settingsApi";
import { toast } from "react-hot-toast";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Mail,
  Globe,
  Eye,
  EyeOff,
  Camera,
  Save,
  X,
  Trophy,
  Check,
} from "lucide-react";
import RenderAccountTab from "./settings/accountTab/renderAccountTab";
import Scoreboard from "./settings/scoreboardTab/renderScoreboardTab";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data - replace with actual user data later
  const [userData, setUserData] = useState({
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      bio: "Passionate student focused on academic excellence",
      avatar: null,
      createdAt: null,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      studyReminders: true,
      progressUpdates: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      allowMessages: true,
      dataSharing: false,
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      colorScheme: "default",
    },
    account: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // TanStack Query: fetch profile data
  const { data: profileData, isLoading, isError } = useProfileQuery();

  React.useEffect(() => {
    if (profileData) {
      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData,
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

  const handleSave = (section) => {
    // TODO: Implement API call to save settings
    console.log(`Saving ${section} settings:`, userData[section]);
    // Show success message
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement file upload to backend
      console.log("Avatar file selected:", file);
      // Update avatar preview
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "scoreboard", label: "Scoreboard", icon: Trophy },
    // { id: "notifications", label: "Notifications", icon: Bell },
    // { id: "privacy", label: "Privacy", icon: Shield },
    // { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: Key },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
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
          <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Picture
          </h3>
          <p className="text-sm text-gray-600">Upload a new profile picture</p>
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

      {/* Loading/Error States */}
      {isLoading && <div className="text-gray-500">Loading profile...</div>}
      {isError && <div className="text-red-500">Error loading profile.</div>}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={userData.profile.firstName}
            onChange={(e) =>
              handleInputChange("profile", "firstName", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={userData.profile.lastName}
            onChange={(e) =>
              handleInputChange("profile", "lastName", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div> */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={userData.profile.username}
            onChange={(e) =>
              handleInputChange("profile", "username", e.target.value)
            }
            // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            Email
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="email"
              type="email"
              value={userData.profile.email}
              onChange={(e) =>
                handleInputChange("profile", "email", e.target.value)
              }
              // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              className="input flex-1"
              disabled={isLoading}
              autoComplete="off"
            />

            <div className="flex items-center space-x-2">
              {/* Verified/Unverified icon */}
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
                    // disable via loading indicator by relying on isLoading from profile fetch
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
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  userData.profile.emailVerified
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {userData.profile.emailVerified ? "Verified" : "Verify Email"}
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={userData.profile.bio || ""}
            onChange={(e) =>
              handleInputChange("profile", "bio", e.target.value)
            }
            rows={3}
            // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            className="textarea w-full h-32"
            disabled={isLoading || !userData.profile.bio}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("profile")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
          disabled={isLoading}
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(userData.notifications).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-900 capitalize">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h4>
              <p className="text-sm text-gray-600">
                {key === "emailNotifications" &&
                  "Receive notifications via email"}
                {key === "pushNotifications" &&
                  "Receive push notifications in browser"}
                {key === "studyReminders" &&
                  "Get reminded about study sessions"}
                {key === "progressUpdates" &&
                  "Receive updates on your learning progress"}
                {key === "marketingEmails" &&
                  "Receive promotional and marketing emails"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  handleInputChange("notifications", key, e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("notifications")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Save size={18} />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Profile Visibility</h4>
          <p className="text-sm text-gray-600 mb-3">
            Control who can see your profile and progress
          </p>
          <select
            value={userData.privacy.profileVisibility}
            onChange={(e) =>
              handleInputChange("privacy", "profileVisibility", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="public">Public - Anyone can see</option>
            <option value="friends">Friends only</option>
            <option value="private">Private - Only you</option>
          </select>
        </div>

        {Object.entries(userData.privacy)
          .filter(([key]) => key !== "profileVisibility")
          .map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900 capitalize">
                  {key === "showProgress" && "Show Learning Progress"}
                  {key === "allowMessages" && "Allow Messages from Others"}
                  {key === "dataSharing" && "Share Data for Research"}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === "showProgress" &&
                    "Display your learning progress to others"}
                  {key === "allowMessages" &&
                    "Allow other users to send you messages"}
                  {key === "dataSharing" &&
                    "Share anonymous data to improve the platform"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    handleInputChange("privacy", key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("privacy")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Save size={18} />
          <span>Save Privacy Settings</span>
        </button>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={userData.appearance.theme}
            onChange={(e) =>
              handleInputChange("appearance", "theme", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <select
            value={userData.appearance.fontSize}
            onChange={(e) =>
              handleInputChange("appearance", "fontSize", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Scheme
          </label>
          <select
            value={userData.appearance.colorScheme}
            onChange={(e) =>
              handleInputChange("appearance", "colorScheme", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="default">Default</option>
            <option value="highContrast">High Contrast</option>
            <option value="colorBlind">Color Blind Friendly</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("appearance")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Save size={18} />
          <span>Save Appearance</span>
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "scoreboard":
        return <Scoreboard />;
      case "notifications":
        return renderNotificationsTab();
      case "privacy":
        return renderPrivacyTab();
      case "appearance":
        return renderAppearanceTab();
      case "account":
        return <RenderAccountTab email={userData.profile.email} />;
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-gray-600">
          Customize your experience and manage your account
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
