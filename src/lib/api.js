import { API_BASE_URL } from "@/lib/backendAPI";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readResponseBody(response) {
  const text = await response.text().catch(() => "");

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(body, fallbackMessage) {
  if (body && typeof body === "object") {
    const candidate = body.message || body.error || body.detail;

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  return fallbackMessage;
}

function createApiError(response, body, fallbackMessage) {
  const error = new Error(extractErrorMessage(body, fallbackMessage));
  error.status = response.status;
  error.body = body;
  return error;
}

export const api = {
  // Register user
  register: async (userData) => {
    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables.",
      );
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify(userData),
    });

    const body = await readResponseBody(response);

    if (!response.ok) {
      throw createApiError(response, body, "Registration failed");
    }

    return body;
  },

  // Login user
  login: async (credentials) => {
    const loginUrl = `${API_BASE_URL}/login`;

    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables.",
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

      const body = await readResponseBody(response);

      if (!response.ok) {
        console.error(`❌ Login API error response:`, body);
        throw createApiError(response, body, "Login failed");
      }

      return body;
    } catch (error) {
      console.error(`❌ Fetch error:`, error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables.",
      );
    }

    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    const body = await readResponseBody(response);

    if (!response.ok) {
      throw createApiError(response, body, "Logout failed");
    }
    return body;
  },

  // Get user profile (alternative endpoint)
  getProfile: async () => {
    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables.",
      );
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    const body = await readResponseBody(response);

    if (!response.ok) {
      throw createApiError(
        response,
        body,
        `Failed to get profile data: ${response.status}`,
      );
    }

    return body;
  },

  waitForProfile: async (options = {}) => {
    const {
      maxAttempts = 6,
      initialDelay = 300,
      maxDelay = 2000,
      backoffMultiplier = 1.5,
    } = options;
    let delay = initialDelay;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        return await api.getProfile();
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          console.warn("Failed to confirm session via profile endpoint:", error);
          return null;
        }

        // eslint-disable-next-line no-await-in-loop
        await wait(delay);
        delay = Math.min(maxDelay, Math.floor(delay * backoffMultiplier));
      }
    }

    return null;
  },
};

// Contact form API
export const submitContactMessage = async (messageData) => {
  try {
    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables."
      );
    }

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
    if (!API_BASE_URL) {
      throw new Error(
        "Backend API URL not configured. Please check your environment variables."
      );
    }

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
