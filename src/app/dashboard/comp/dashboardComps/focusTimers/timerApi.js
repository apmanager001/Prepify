import { API_BASE_URL } from "@/lib/backendAPI";

// API utility for /timer route
export async function getTimer() {
  const res = await fetch(`${API_BASE_URL}/timer`, { credentials: "include" });

  // parse response safely (some endpoints may return text on error)
  const text = await res.text().catch(() => "");
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const msg =
      (body && body.error) ||
      (typeof body === "string" && body) ||
      res.statusText;
    throw new Error(`Failed to fetch timers: ${res.status} ${msg}`);
  }

  // return the parsed body (controller returns { timers: [...] })
  return body;
}

export async function addTimer(timerData) {
  // normalize + validate input on the client before sending
  const name = String(timerData?.name ?? "").trim();
  const minutes = Number(timerData?.minutes);

  if (!name) {
    throw new Error("Timer name cannot be empty.");
  }
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error("Minutes must be a positive number.");
  }

  const payload = { name, minutes };

  const res = await fetch(`${API_BASE_URL}/timer`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // parse response body safely (may be text or JSON)
  const text = await res.text().catch(() => "");
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const msg =
      (body && body.error) ||
      (typeof body === "string" && body) ||
      res.statusText;
    throw new Error(`Failed to add timer: ${res.status} ${msg}`);
  }

  return body;
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
