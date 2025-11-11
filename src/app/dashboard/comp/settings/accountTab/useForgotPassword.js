import { useMutation } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/backendAPI";

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
