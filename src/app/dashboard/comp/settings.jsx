"use client";

import React, { useState } from "react";
import { useProfileQuery } from "./useProfileQuery";
import RenderProfileTab from "./settings/profileTab/renderProfileTab";
import StudyGoalsTab from "./settings/studyGoalsTab/studyGoalTab";
import { sendVerificationEmail } from "./settingsApi";
import { toast } from "react-hot-toast";
import { User, Key, Save, Trophy, GraduationCap } from "lucide-react";
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
    { id: "studyGoals", label: "Study Goals", icon: GraduationCap },
    // { id: "notifications", label: "Notifications", icon: Bell },
    // { id: "privacy", label: "Privacy", icon: Shield },
    // { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: Key },
  ];

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
            <label htmlFor={`notification-toggle-${key}`} className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={`notification-toggle-${key}`}
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
              <label htmlFor={`privacy-toggle-${key}`} className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={`privacy-toggle-${key}`}
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
          <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            id="theme-select"
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
        return <RenderProfileTab />;
      case "scoreboard":
        return <Scoreboard />;
      case "studyGoals":
        return <StudyGoalsTab />;
      case "notifications":
        return renderNotificationsTab();
      case "privacy":
        return renderPrivacyTab();
      case "appearance":
        return renderAppearanceTab();
      case "account":
        return <RenderAccountTab email={userData.profile.email} />;
      default:
        return RenderProfileTab();
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
      <div className="bg-base-200 rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav
            className="flex flex-col md:flex-row space-x-8 px-6"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-black/30 text-gray-500 hover:text-black hover:border-black"
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
        <div className="p-8 min-h-[60vh]">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
