"use client";
import React, { useState } from "react";
import {
  Copy,
  Trash2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Eye,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContactMessages, updateMessageReadStatus } from "@/lib/api";

const ContactMessages = () => {
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const queryClient = useQueryClient();

  // Fetch contact messages using TanStack Query
  const {
    data: contactMessages = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: getContactMessages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for updating message read status
  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, readStatus }) =>
      updateMessageReadStatus(messageId, readStatus),
    onSuccess: () => {
      // Invalidate and refetch contact messages
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
    onError: (error) => {
      console.error("Failed to update message status:", error);
    },
  });

  const markAsRead = (messageId) => {
    updateMessageMutation.mutate({
      messageId,
      readStatus: true,
    });
  };

  const toggleMessageExpansion = (messageId) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">
            View and manage user contact form submissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {isLoading ? "Loading..." : `${contactMessages.length} messages`}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="cursor-pointer p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh messages"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Unread:</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              {contactMessages.filter((m) => !m.read).length}
            </span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading messages
              </h3>
              <p className="text-sm text-red-600 mt-1">{error.message}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
          <div className="text-center">
            {/* <RefreshCw
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            /> */}
            <RefreshCw
              size={18}
              className={`cursor-pointer transition-transform ${
                isLoading ? "animate-spin text-blue-500" : "text-gray-400"
              }`}
            />

            <p className="text-gray-600">Loading contact messages...</p>
          </div>
        </div>
      )}

      {/* Content State */}
      {!isLoading && !error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {contactMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600">
                Contact form submissions will appear here once users start
                sending messages.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactMessages.map((message) => (
                    <React.Fragment key={message._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                !message.read
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {!message.read ? "Unread" : "Read"}
                            </span>
                            {!message.read && (
                              <button
                                onClick={() => markAsRead(message._id)}
                                disabled={updateMessageMutation.isPending}
                                className="tooltip tooltip-right cursor-pointer p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Mark as read"
                                data-tip="Mark as read"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {message.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => copyEmail(message.email)}
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{message.email}</span>
                            <Copy size={14} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <button
                            onClick={() => toggleMessageExpansion(message._id)}
                            className="text-left w-full hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                          >
                            <div className="truncate" title={message.message}>
                              {message.message}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              {expandedMessages.has(message._id)
                                ? "Click to collapse"
                                : "Click to expand"}
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          <button className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg transition-colors duration-200 cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                      {/* Expanded Message Row */}
                      {expandedMessages.has(message._id) && (
                        <tr key={`${message._id}-expanded`}>
                          <td
                            colSpan="6"
                            className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                          >
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">
                                  Full Message
                                </h4>
                                <button
                                  onClick={() =>
                                    toggleMessageExpansion(message._id)
                                  }
                                  className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                  Collapse
                                </button>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                  {message.message}
                                </p>
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                                <span>
                                  From: {message.name} ({message.email})
                                </span>
                                <span>
                                  Date:{" "}
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
