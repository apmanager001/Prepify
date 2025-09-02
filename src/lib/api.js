// API utility functions for authentication
// Last updated: $(date)

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}

export const api = {
  // Register user
  register: async (userData) => {
    console.log("🔍 Register API call to:", `${API_BASE_URL}/register`);
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  // Login user
  login: async (credentials) => {
    const requestId = Math.random().toString(36).substr(2, 9);
    const loginUrl = `${API_BASE_URL}/login`;

    console.log(`🔍 [${requestId}] Login API call to:`, loginUrl);
    console.log(`🔍 [${requestId}] Credentials being sent:`, credentials);
    console.log(`🔍 [${requestId}] API_BASE_URL:`, API_BASE_URL);
    console.log(`🔍 [${requestId}] Full URL:`, loginUrl);
    console.log(`🔍 [${requestId}] Request method: POST`);
    console.log(`🔍 [${requestId}] Request body:`, JSON.stringify(credentials));

    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables."
      );
    }

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      console.log(`🔍 [${requestId}] Login response status:`, response.status);
      console.log(
        `🔍 [${requestId}] Login response headers:`,
        response.headers
      );
      console.log(`🔍 [${requestId}] Response URL:`, response.url);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`❌ [${requestId}] Login API error response:`, error);
        throw new Error(error.message || "Login failed");
      }

      const responseData = await response.json();
      console.log(
        `✅ [${requestId}] Login API success response:`,
        responseData
      );
      return responseData;
    } catch (error) {
      console.error(`❌ [${requestId}] Fetch error:`, error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return response.json();
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      throw new Error("Failed to get user data");
    }

    return response.json();
  },

  // Get user profile (alternative endpoint)
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      throw new Error("Failed to get profile data");
    }

    return response.json();
  },
};

// Contact form API
export const submitContactMessage = async (messageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send message");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};

// Newsletter subscription API
export const subscribeToNewsletter = async (emailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to subscribe to newsletter");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};

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
