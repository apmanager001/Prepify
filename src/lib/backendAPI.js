const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}

module.exports = {
  API_BASE_URL,
};