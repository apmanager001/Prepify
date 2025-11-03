const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}
// API utility for /timer route
export async function getTimer() {
  const res = await fetch(`${API_BASE_URL}/timer`, { credentials: "include" });
  const data = await res.json();
  return data;
}

export async function addTimer(timerData) {
  const res = await fetch(`${API_BASE_URL}/timer`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timerData),
  });
  const data = await res.json();
  return data;
}
