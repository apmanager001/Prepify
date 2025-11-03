const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}

// API utility for /profile routes
export async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

export async function updateProfile(profile) {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profile),
  });
  return await res.json();
}
