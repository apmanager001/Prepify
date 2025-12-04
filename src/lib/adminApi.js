import { API_BASE_URL } from "@/lib/backendAPI";

// Admin API - Get newsletter subscribers
export const getNewsletterSubscribers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/newsletter`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for admin authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch newsletter subscribers"
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};

// Admin API - Get all contact messages
export const getContactMessages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/message`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for admin authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch contact messages");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};

// Admin API - Update message read status
export const updateMessageReadStatus = async (messageId, readStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/message/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for admin authentication
      body: JSON.stringify({ read: readStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update message status");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};

// Admin API - Delete contact message
export const deleteContactMessage = async (messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/message/${messageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for admin authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete message");
    }

    // Return success status for 204 No Content
    return { success: true, status: response.status };
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};
