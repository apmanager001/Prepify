import { API_BASE_URL } from "@/lib/backendAPI";
import { addScoreAndInvalidate } from "./dashboardComps/useTotalScore";
import toast from "react-hot-toast";
// API utility for /profile routes

// Helper to handle fetch responses. Redirects to `/login` on 401.
async function handleResponse(res) {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      // Send user to login when unauthorized
      window.location.href = "/login";
    }
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const txt = await res.text();
    const err = new Error(txt || `HTTP ${res.status}`);
    err.status = res.status;
    try {
      err.body = JSON.parse(txt);
    } catch {
      err.body = txt;
    }
    throw err;
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    credentials: "include",
  });
  return await handleResponse(res);
}

export async function updateProfile(profile) {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profile),
  });
  return await handleResponse(res);
}

export async function getStudyGoals() {
  const res = await fetch(`${API_BASE_URL}/studyGoals`, {
    method: "GET",
    credentials: "include",
  });

  return await handleResponse(res);
}

export async function updateStudyGoals({ studyGoals, percentComplete }) {
  const res = await fetch(`${API_BASE_URL}/studyGoals`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(studyGoals),
  });

  const body = await handleResponse(res);
  if (percentComplete === 100) {
    const { status } = await addScoreAndInvalidate("completeStudyGoal");
    if (status === 201 || status === 214) {
      toast.success("You have earned points for completing your study goals!");
    }
  }
  toast.success("Study goals saved");
  return body;
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

  return await handleResponse(res);
}
