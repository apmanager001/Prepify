"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { BookOpen, Target, BarChart3, Calendar, Award } from "lucide-react";

const Main = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data from API to validate session
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
    retry: 1,
    onError: (error) => {
      console.error("Profile fetch error:", error);
    },
  });

  // Update user data when profile is fetched
  useEffect(() => {
    if (profileData) {
      setUserData({
        username: profileData.username || userData.username,
        email: profileData.email || userData.email,
        userId: profileData.userId || userData.userId,
      });
      // Update localStorage with fresh data
      if (profileData.username)
        localStorage.setItem("username", profileData.username);
      if (profileData.email) localStorage.setItem("email", profileData.email);
      if (profileData.userId)
        localStorage.setItem("userId", profileData.userId);
      setIsLoading(false);
    }
  }, [profileData]);

  // Handle loading and error states
  useEffect(() => {
    if (profileError) {
      setError(profileError.message);
      setIsLoading(false);
    }
  }, [profileError]);

  // Show loading state
  if (isLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <span>Error loading dashboard: {error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.username || "Student"}! 👋
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
              <p className="text-blue-100 text-sm font-medium">Study Streak</p>
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
              <p className="text-lg font-medium text-gray-900">
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
            <span className="text-purple-600 font-semibold">New Badge!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
