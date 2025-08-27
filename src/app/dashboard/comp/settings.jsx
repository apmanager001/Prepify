"use client";

import React, { useState } from "react";
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
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock user data - replace with actual user data later
  const [userData, setUserData] = useState({
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      bio: "Passionate student focused on academic excellence",
      avatar: null,
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
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
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
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={userData.profile.username}
            onChange={(e) =>
              handleInputChange("profile", "username", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={userData.profile.email}
            onChange={(e) =>
              handleInputChange("profile", "email", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={userData.profile.bio}
            onChange={(e) =>
              handleInputChange("profile", "bio", e.target.value)
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("profile")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
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

  const renderAccountTab = () => (
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={userData.account.currentPassword}
              onChange={(e) =>
                handleInputChange("account", "currentPassword", e.target.value)
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={userData.account.newPassword}
              onChange={(e) =>
                handleInputChange("account", "newPassword", e.target.value)
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={userData.account.confirmPassword}
            onChange={(e) =>
              handleInputChange("account", "confirmPassword", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setUserData((prev) => ({
              ...prev,
              account: {
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              },
            }));
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => handleSave("account")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Save size={18} />
          <span>Change Password</span>
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "privacy":
        return renderPrivacyTab();
      case "appearance":
        return renderAppearanceTab();
      case "account":
        return renderAccountTab();
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
