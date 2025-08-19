// API utility functions for authentication

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

export const api = {
  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    });

    if (!response.ok) {
      throw new Error("Failed to get user data");
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
