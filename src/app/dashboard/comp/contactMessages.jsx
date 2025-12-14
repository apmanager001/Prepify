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
import {
  getContactMessages,
  updateMessageReadStatus,
  deleteContactMessage,
} from "@/lib/adminApi";

const ContactMessages = () => {
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
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
      // Show success toast
      setToast({
        type: "success",
        message: "Message marked as read",
      });
      // Auto-hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    },
    onError: (error) => {
      console.error("Failed to update message status:", error);
      // Show error toast
      setToast({
        type: "error",
        message: error.message || "Failed to mark message as read",
      });
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    },
  });

  // Mutation for deleting contact message
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId) => deleteContactMessage(messageId),
    onSuccess: () => {
      // Invalidate and refetch contact messages
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      setDeleteConfirm(null);
      // Show success toast
      setToast({
        type: "success",
        message: "Message deleted successfully",
      });
      // Auto-hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    },
    onError: (error) => {
      console.error("Failed to delete message:", error);
      setDeleteConfirm(null);
      // Show error toast
      setToast({
        type: "error",
        message: error.message || "Failed to delete message",
      });
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
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

  const handleDeleteClick = (message) => {
    setDeleteConfirm({
      id: message._id,
      name: message.name,
      email: message.email,
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMessageMutation.mutate(deleteConfirm.id);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
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
        <div className="bg-base-200 border border-red-200 rounded-xl p-4">
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
        <div className="bg-base-200 rounded-2xl shadow-lg border border-gray-100 p-12">
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
        <div className="bg-base-300 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                <thead className="bg-base-300 border-b border-gray-200 text-center">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Message
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#FDCD5D] divide-y divide-gray-200">
                  {contactMessages.map((message) => (
                    <React.Fragment key={message._id}>
                      <tr className="">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                !message.read
                                  ? "text-red-800"
                                  : "text-green-800"
                              }`}
                            >
                              {!message.read ? "Unread" : "Read"}
                            </span>
                            {!message.read && (
                              <button
                                onClick={() => markAsRead(message._id)}
                                disabled={updateMessageMutation.isPending}
                                className="tooltip tooltip-right cursor-pointer p-1.5 text-gray-500 hover:text-blue-600 hover:bg-base-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="text-left w-full hover:bg-base-300 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
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
                          <button
                            onClick={() => handleDeleteClick(message)}
                            disabled={deleteMessageMutation.isPending}
                            className="text-red-600 hover:text-red-800 hover:bg-base-300 p-1.5 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete message"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                      {/* Expanded Message Row */}
                      {expandedMessages.has(message._id) && (
                        <tr key={`${message._id}-expanded`}>
                          <td
                            colSpan="6"
                            className="px-6 py-4 bg-base-300 border-t border-gray-200"
                          >
                            <div className="bg-[#FDCD5D] rounded-lg p-4 border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">
                                  Full Message
                                </h4>
                                <button
                                  onClick={() =>
                                    toggleMessageExpansion(message._id)
                                  }
                                  className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                                >
                                  Collapse
                                </button>
                              </div>
                              <div className="bg-base-300 rounded-lg p-4">
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Message
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete the message from:
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">
                  {deleteConfirm.name}
                </p>
                <p className="text-sm text-gray-600">{deleteConfirm.email}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                disabled={deleteMessageMutation.isPending}
                className="cursor-pointer flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMessageMutation.isPending}
                className="cursor-pointer flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {deleteMessageMutation.isPending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DaisyUI Toast */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${
              toast.type === "success"
                ? "alert-success"
                : toast.type === "error"
                ? "alert-error"
                : "alert-info"
            }`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : toast.type === "error" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
