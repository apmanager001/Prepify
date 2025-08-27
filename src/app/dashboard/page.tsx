"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LogOut, Menu, X, Shield, Hammer } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import StudyGuides from "./comp/studyGuides/studyGuides";
import Main from "./comp/main";
import SettingsPage from "./comp/settings";
import AdminPage from "./comp/adminPage";
import Tools from "./comp/tools";

// Define the user data type
interface UserData {
  username?: string;
  email?: string;
  userId?: string;
  isAdmin?: boolean;
}

const Dashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<UserData>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("isAdmin");
      // Redirect to home page
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local data and redirect
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("isAdmin");
      router.push("/");
    },
  });

  // Sidebar items
  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "studyGuides",
      label: "Study Guides",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "tools",
      label: "Study Tools",
      icon: () => <Hammer size={24} />,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "resources",
      label: "Resources",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4"
          />
        </svg>
      ),
    },
    {
      id: "community",
      label: "Community",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    // Admin-only item
    ...(userData.isAdmin
      ? [
          {
            id: "admin",
            label: "Admin Panel",
            icon: () => <Shield size={24} />,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get user data from localStorage
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (userId && username && email) {
        setUserData({
          userId,
          username,
          email,
          isAdmin,
        });
      } else {
        // If no user data, redirect to login
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Main />;
      case "studyGuides":
        return <StudyGuides />;
      case "tools":
        return <Tools />;
      case "calendar":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Calendar
              </h1>
              <p className="text-lg text-gray-600">
                Plan and schedule your study sessions
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Study Calendar
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Schedule study sessions, set reminders, and organize your
                  learning calendar for optimal productivity.
                </p>
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Open Calendar
                </button>
              </div>
            </div>
          </div>
        );
      case "resources":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Resources
              </h1>
              <p className="text-lg text-gray-600">
                Access study materials and learning resources
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Learning Resources
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Browse through a comprehensive collection of study materials,
                  practice tests, and educational resources.
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Browse Resources
                </button>
              </div>
            </div>
          </div>
        );
      case "community":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Community
              </h1>
              <p className="text-lg text-gray-600">
                Connect with fellow students and study groups
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Study Community
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Join study groups, participate in discussions, and collaborate
                  with peers to enhance your learning experience.
                </p>
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        );
      case "settings":
        return <SettingsPage />;
      case "admin":
        return <AdminPage />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Welcome to your personalized learning dashboard
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 hover:bg-white transition-colors"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col">
            {/* Logo Section */}
            <div className="border-b border-gray-100  flex-shrink-0">
              <div className="flex flex-col items-center">
                <Image
                  src="/logoSlogan.webp"
                  alt="Prepify"
                  width={100}
                  height={20}
                  className="h-32 w-32"
                  priority={true}
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group cursor-pointer ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:bg-white/60 hover:text-primary hover:shadow-md"
                    }`}
                  >
                    <Icon />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Section & Logout */}
            <div className="p-6 border-t border-gray-100 flex-shrink-0">
              <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {userData.username || "User"}
                </p>
                <p className="text-xs text-gray-600">
                  {userData.email || "user@example.com"}
                </p>
                {userData.isAdmin && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    Administrator
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300 group disabled:opacity-50"
              >
                {logoutMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <LogOut size={22} />
                )}
                <span className="font-semibold">
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 flex flex-col">
          {/* Logo Section */}
          <div className="border-b border-gray-100">
            <div className="flex flex-col items-center">
              <Image
                src="/logoSlogan.webp"
                alt="Prepify"
                width={100}
                height={20}
                className="h-40 w-40"
                priority={true}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group cursor-pointer ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-white/60 hover:text-primary hover:shadow-md"
                  }`}
                >
                  <Icon />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section & Logout */}
          <div className="p-6 border-t border-gray-100">
            <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {userData.username || "User"}
              </p>
              <p className="text-xs text-gray-600">
                {userData.email || "user@example.com"}
              </p>
              {userData.isAdmin && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  Administrator
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300 group disabled:opacity-50"
            >
              {logoutMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <LogOut size={22} />
              )}
              <span className="font-semibold">
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden pt-20 px-4 pb-8">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
