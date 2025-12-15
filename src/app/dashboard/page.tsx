"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  LogOut,
  Menu,
  X,
  Shield,
  NotebookPen,
  CheckSquare,
  ChartNoAxesColumn,
  Calendar as CalendarIcon,
  UsersRound,
  Settings,
  Fullscreen,
} from "lucide-react";
import Stats from "./comp/dashboardComps/sidebarStats/stats";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import StudyGuides from "./comp/studyGuides/studyGuides";
import Notes from "./comp/notes/notes";
import Todo from "./comp/todo/todo";
import { useProfileQuery } from "./comp/useProfileQuery";
// import Main from "./comp/main";
// import DashboardPage from "./comp/dashboardComps/dashboard";
import Overview from "./comp/dashboardComps/overview";
import SettingsPage from "./comp/settings";
import AdminPage from "./comp/adminPage";
import Tools from "./comp/tools";
import Community from "./comp/community.jsx/community";
import Calendar from "./comp/calendar/calendar";
import LoadingComp from "@/lib/loading";
import FeedbackWidget from "./cornerTools/feedbackWidget";
import ToolsButton from "./cornerTools/tools";
import CornerWidgets from "./cornerTools/cornerWidgets";

const Dashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const { data: profileData, isLoading: profileLoading } = useProfileQuery();
  const [userData, setUserData] = useState({
    profile: {
      username: "",
      email: "",
      isAdmin: false,
      screenname: "",
      createdAt: "",
    },
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      // Redirect to home page after successful logout
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Redirect to home page even if logout failed
      router.push("/");
    },
  });

  React.useEffect(() => {
    if (profileData) {
      // If the response includes a status field and it's not OK, redirect to login
      if (
        typeof profileData.status === "number" &&
        profileData.status !== 200
      ) {
        router.push("/login");
        return;
      }

      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          // prefer values from profileData, fall back to existing state
          username: profileData.username ?? prev.profile.username,
          email: profileData.email ?? prev.profile.email,
          isAdmin:
            typeof profileData.isAdmin === "boolean"
              ? profileData.isAdmin
              : prev.profile.isAdmin,
          screenname: profileData.screenname ?? prev.profile.screenname,
          createdAt: profileData.createdAt ?? prev.profile.createdAt,
        },
      }));
    }
  }, [profileData, router]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100">
        <LoadingComp />
      </div>
    );
  }

  // Sidebar items
  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: () => <ChartNoAxesColumn size={24} />,
    },
    // {
    //   id: "studyGuides",
    //   label: "Study Guides",
    //   icon: () => (
    //     <svg
    //       className="w-6 h-6"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   id: "tools",
    //   label: "Study Tools",
    //   icon: () => <Hammer size={24} />,
    // },
    {
      id: "notes",
      label: "Notes",
      icon: () => <NotebookPen size={24} />,
    },
    {
      id: "todo",
      label: "To-Do",
      icon: () => <CheckSquare size={24} />,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: () => <CalendarIcon size={24} />,
    },
    // {
    //   id: "resources",
    //   label: "Resources",
    //   icon: () => <FolderClosed size={24} />,
    // },
    {
      id: "community",
      label: "Community",
      icon: () => <UsersRound size={24} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: () => <Settings size={24} />,
    },
    // Admin-only item
    ...(userData?.profile?.isAdmin
      ? [
          {
            id: "admin",
            label: "Admin Panel",
            icon: () => <Shield size={24} />,
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      // <Main />;
      case "studyGuides":
        return <StudyGuides />;
      case "notes":
        return <Notes />;
      case "todo":
        return <Todo />;
      case "tools":
        return <Tools />;
      case "calendar":
        return <Calendar />;
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
            <div className="bg-base-100 rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
                <button className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Browse Resources
                </button>
              </div>
            </div>
          </div>
        );
      case "community":
        return <Community />;
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <label
          htmlFor="menu-toggle"
          className="swap swap-rotate btn rounded-lg"
        >
          <input
            id="menu-toggle"
            type="checkbox"
            checked={isMobileMenuOpen}
            onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          />

          <Menu size={24} className="swap-off text-gray-700" />
          <X size={24} className="swap-on text-gray-700" />
        </label>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-neutral backdrop-blur-xl shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col">
            <div className="flex flex-col items-center border-b border-gray-100">
              <Image
                src="/WhiteLogoWithSlogan.webp"
                alt="Prepify"
                width={128}
                height={128}
                className="rounded-full object-cover object-center"
                priority={true}
              />
            </div>

            {/* Logo Section */}
            <div className="flex flex-col justify-between mt-2 mx-2">
              <Stats />
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
                        ? "bg-primary text-primary-content shadow-lg transform scale-105"
                        : "text-neutral-content hover:bg-base-100/30 hover:shadow-md"
                    }`}
                  >
                    <Icon />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Section & Logout */}
            <div className="p-6 border-t border-gray-100 shrink-0">
              <div className="mb-4 p-4 bg-base-200 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {userData?.profile?.username?.startsWith("\\google")
                        ? ""
                        : userData?.profile?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {userData?.profile?.email || "user@example.com"}
                    </p>
                    {userData?.profile?.isAdmin && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        Administrator
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 ml-2">
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:shadow transition-all duration-200 disabled:opacity-50"
                      aria-label="Logout"
                    >
                      {logoutMutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <LogOut size={18} />
                      )}
                      <span className="hidden sm:inline font-semibold">
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-neutral backdrop-blur-xl shadow-2xl border-r border-white/20 flex flex-col h-screen overflow-y-auto">
          {/* Logo Section */}
          <div className="border-b border-gray-100">
            <div className="flex flex-col items-center ">
              <Image
                src="/WhiteLogoWithSlogan.webp"
                alt="Prepify"
                width={160}
                height={160}
                className="rounded-full object-cover object-center"
                priority={true}
              />
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-6 md:p-3 space-y-3 overflow-y-auto">
            <div className="flex-1 flex flex-col justify-between">
              <Stats />
            </div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group cursor-pointer ${
                    activeTab === item.id
                      ? "bg-primary text-primary-content shadow-lg transform scale-105"
                      : "text-neutral-content hover:bg-base-100/30 hover:shadow-md"
                  }`}
                >
                  <Icon />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section & Logout */}
          <div className="pt-1 px-4 border-t border-gray-100">
            <div className="mb-4 p-4 bg-base-200 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  {profileLoading ? (
                    <LoadingComp />
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                        {userData?.profile?.username?.startsWith("\\google")
                          ? ""
                          : userData?.profile?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {userData?.profile?.email || "user@example.com"}
                      </p>
                      {userData?.profile?.isAdmin && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                          Administrator
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="shrink-0 ml-2">
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="btn btn-error btn-soft rounded-2xl"
                    aria-label="Logout"
                  >
                    {logoutMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <LogOut size={18} />
                    )}
                    <span className="hidden sm:inline font-semibold">
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-base-100 p-8 overflow-y-auto h-screen">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden pt-20 px-4 pb-12">{renderContent()}</div>
      <CornerWidgets />
    </div>
  );
};

export default Dashboard;
