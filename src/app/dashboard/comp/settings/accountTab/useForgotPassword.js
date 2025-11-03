import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}

// const useForgotPassword = () => {
//   const mutationFn = async ({ email }) => {
//     console.log("Mutation function called with email:", email);
//     const response = await fetch(`${API_BASE_URL}/forgot-password`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email }),
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   };

//   console.log("useForgotPassword hook initialized with mutationFn:", mutationFn);
//   return useMutation(mutationFn);
// };

const useForgotPassword = async (email) => {
  try {
    console.log("Forgot password request for email:", email);
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Forgot password request succeeded:", data);
    return data;
  } catch (error) {
    console.error("Forgot password request failed:", error);
    throw error;
  }
};

export default useForgotPassword;
