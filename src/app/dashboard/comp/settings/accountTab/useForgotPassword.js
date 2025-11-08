import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}

const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();
      let json;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!response.ok) {
        const msg =
          (json && (json.message || json.error)) ||
          text ||
          `Request failed: ${response.status}`;
        const err = new Error(msg);
        // attach status and body for callers
        err.status = response.status;
        err.body = json || text;
        throw err;
      }

      return json;
    },
  });
};

export default useForgotPassword;
