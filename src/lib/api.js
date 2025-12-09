import { API_BASE_URL } from "@/lib/backendAPI";
export const api = {
  // Register user
  register: async (userData) => {
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

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`❌ [${requestId}] Login API error response:`, error);
        throw new Error(error.message || "Login failed");
      }

      const responseData = await response.json();

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
      throw new Error(`Failed to get profile data: ${response.status}`);
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
