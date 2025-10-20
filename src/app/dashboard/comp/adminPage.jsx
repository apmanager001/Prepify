"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Copy,
  Check,
  Users,
  Settings,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { getNewsletterSubscribers } from "@/lib/adminApi";
import ContactMessages from "./contactMessages";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("newsletter");
  const [copied, setCopied] = useState(false);

  // Newsletter state
  const [newsletterEmails, setNewsletterEmails] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(true);
  const [newsletterError, setNewsletterError] = useState(null);
  // Fetch newsletter subscribers on component mount
  useEffect(() => {
    if (activeTab === "newsletter") {
      fetchNewsletterSubscribers();
    }
  }, [activeTab]);

  const fetchNewsletterSubscribers = async () => {
    try {
      setNewsletterLoading(true);
      setNewsletterError(null);
      const response = await getNewsletterSubscribers();

      // Extract emails from the response based on the OpenAPI spec
      // The API returns an array of subscriber objects with email, createdAt, etc.
      const emails = response[0]
        ? response.map((sub) => sub.email)
        : [];
      setNewsletterEmails(emails);
    } catch (error) {
      console.error("Failed to fetch newsletter subscribers:", error);
      setNewsletterError(error.message);
    } finally {
      setNewsletterLoading(false);
    }
  };

  const copyAllEmails = async () => {
    const emailList = newsletterEmails.join(", ");
    try {
      await navigator.clipboard.writeText(emailList);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy emails:", err);
    }
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const renderNewsletterTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Newsletter Subscribers
          </h2>
          <p className="text-gray-600">Manage newsletter email subscriptions</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {newsletterLoading
              ? "Loading..."
              : `${newsletterEmails.length} subscribers`}
          </span>
          <button
            onClick={fetchNewsletterSubscribers}
            disabled={newsletterLoading}
            className="p-2 text-gray-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh subscribers"
          >
            <RefreshCw
              size={18}
              className={newsletterLoading ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={copyAllEmails}
            disabled={newsletterLoading || newsletterEmails.length === 0}
            className="btn bg-gradient-to-r cursor-copy from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy All Emails</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error State */}
      {newsletterError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading subscribers
              </h3>
              <p className="text-sm text-red-600 mt-1">{newsletterError}</p>
            </div>
            <button
              onClick={fetchNewsletterSubscribers}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {newsletterLoading && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
          <div className="text-center">
            <RefreshCw
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="text-gray-600">Loading newsletter subscribers...</p>
          </div>
        </div>
      )}

      {/* Content State */}
      {!newsletterLoading && !newsletterError && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {newsletterEmails.length === 0 ? (
            <div className="text-center py-12">
              <Mail size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No subscribers yet
              </h3>
              <p className="text-gray-600">
                Newsletter subscribers will appear here once they sign up.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsletterEmails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Mail size={20} className="text-blue-600" />
                    <span className="text-gray-800 font-medium truncate">
                      {email}
                    </span>
                  </div>
                  <button
                    onClick={() => copyEmail(email)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-copy"
                    title="Copy email"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMessagesTab = () => (
    <ContactMessages />
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={48} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            User Management
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            View user accounts, manage permissions, and handle user-related
            administrative tasks.
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">
          Configure system-wide settings and preferences
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings size={48} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            System Configuration
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Configure system settings, manage integrations, and control
            application behavior.
          </p>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Configure Settings
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "messages", label: "Messages", icon: MessageSquare },
    // { id: "users", label: "Users", icon: Users },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-lg text-gray-600">
          Manage users, content, and system settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {activeTab === "newsletter" && renderNewsletterTab()}
        {activeTab === "messages" && renderMessagesTab()}
        {activeTab === "users" && renderUsersTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </div>
    </div>
  );
};

export default AdminPage;
