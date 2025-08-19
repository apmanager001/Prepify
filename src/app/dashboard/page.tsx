"use client";

import { useState } from "react";
import {
  Home,
  BookOpen,
  Target,
  BarChart3,
  Settings,
  LogOut,
  User,
  Calendar,
  Award,
} from "lucide-react";
import Image from "next/image";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sidebar navigation items
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "study-plans", label: "Study Plans", icon: BookOpen },
    { id: "goals", label: "Goals", icon: Target },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Content components for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {localStorage.getItem("username") || "Student"}!
                  👋
                </h1>
                <p className="text-lg text-gray-600">
                  Here&apos;s your study progress for today
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Today&apos;s Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Study Streak
                    </p>
                    <p className="text-3xl font-bold">7 days</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Award size={24} />
                  </div>
                </div>
                <p className="text-blue-100 text-sm mt-2">🔥 Keep it up!</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Hours Studied
                    </p>
                    <p className="text-3xl font-bold">24.5</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <BarChart3 size={24} />
                  </div>
                </div>
                <p className="text-green-100 text-sm mt-2">📚 This week</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Goals Completed
                    </p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Target size={24} />
                  </div>
                </div>
                <p className="text-purple-100 text-sm mt-2">✅ Out of 5</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">
                      Study Sessions
                    </p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                </div>
                <p className="text-orange-100 text-sm mt-2">📅 This month</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Completed Math Module 3
                    </p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                  <span className="text-green-600 font-semibold">+25 XP</span>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Achieved Daily Goal
                    </p>
                    <p className="text-sm text-gray-600">4 hours ago</p>
                  </div>
                  <span className="text-blue-600 font-semibold">Goal Met!</span>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Earned &ldquo;Consistent Learner&rdquo; Badge
                    </p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                  <span className="text-purple-600 font-semibold">
                    New Badge!
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "study-plans":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Study Plans
              </h1>
              <p className="text-lg text-gray-600">
                Your personalized learning roadmap
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={48} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Create Your First Study Plan
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get personalized study recommendations based on your goals and
                  learning style.
                </p>
                <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Learning Goals
              </h1>
              <p className="text-lg text-gray-600">
                Set targets and track your progress
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target size={48} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Set Your First Goal
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Define what you want to achieve and we&apos;ll help you get
                  there step by step.
                </p>
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Progress Analytics
              </h1>
              <p className="text-lg text-gray-600">
                Track your learning journey
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 size={48} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  View Your Progress
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Detailed analytics and insights to help you understand your
                  learning patterns.
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Achievements
              </h1>
              <p className="text-lg text-gray-600">Celebrate your milestones</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award size={48} className="text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Earn Your First Badge
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Complete challenges and unlock achievements as you progress in
                  your studies.
                </p>
                <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  View Challenges
                </button>
              </div>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Study Calendar
              </h1>
              <p className="text-lg text-gray-600">
                Plan your learning schedule
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar size={48} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Schedule Study Sessions
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Organize your study time and never miss a learning
                  opportunity.
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Open Calendar
                </button>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-lg text-gray-600">Manage your account</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User size={48} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Update Your Profile
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Keep your information up to date and customize your learning
                  experience.
                </p>
                <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-lg text-gray-600">Customize your experience</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings size={48} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Configure Preferences
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Adjust notifications, privacy settings, and other preferences
                  to suit your needs.
                </p>
                <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Open Settings
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-lg text-gray-600">
              Select a section from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 flex flex-col">
        {/* Logo Section */}
        <div className="border-b border-gray-100 pb-4">
          <div className="flex flex-col items-center">
            <Image
              src="/logoNoSlogan.webp"
              alt="Prepify"
              width={100}
              height={20}
              className="h-40 w-40"
              priority={true}
            />

            <p className="text-sm text-primary/80 font-medium">Ace Your Prep</p>
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
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-white/60 hover:text-primary hover:shadow-md"
                }`}
              >
                <Icon size={22} className="flex-shrink-0" />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section & Logout */}
        <div className="p-6 border-t border-gray-100">
          <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {localStorage.getItem("username") || "User"}
            </p>
            <p className="text-xs text-gray-600">
              {localStorage.getItem("email") || "user@example.com"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300 group"
          >
            <LogOut size={22} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
