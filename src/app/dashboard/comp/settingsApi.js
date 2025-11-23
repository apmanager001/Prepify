import { API_BASE_URL } from "@/lib/backendAPI";

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

export async function getStudyGoals() {
  const res = await fetch(`${API_BASE_URL}/studyGoals`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  return data;
}

export async function updateStudyGoals(studyGoals) {

  const res = await fetch(`${API_BASE_URL}/studyGoals`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(studyGoals),
  });
  return await res.json();
}

// Send a verification email to the provided address
export async function sendVerificationEmail(email) {
  if (!email) throw new Error("Email is required");

  const res = await fetch(`${API_BASE_URL}/send-verification-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  // Try to parse JSON body if present
  let body = null;
  try {
    body = await res.json();
  } catch {
    // ignore parse errors
  }

  if (!res.ok) {
    const err = new Error("Failed to send verification email");
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body || { ok: true };
}
