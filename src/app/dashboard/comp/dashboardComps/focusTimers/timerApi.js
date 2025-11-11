import { API_BASE_URL } from "@/lib/backendAPI";

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

export async function deleteTimer(timerId) {
  const res = await fetch(`${API_BASE_URL}/timer/${timerId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete timer");
  }

  return res.json();
}
