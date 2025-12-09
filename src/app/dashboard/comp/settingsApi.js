import { API_BASE_URL } from "@/lib/backendAPI";
import { addScoreAndInvalidate } from "./dashboardComps/useTotalScore";
import toast from "react-hot-toast";
// API utility for /profile routes

export async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    credentials: "include",
  });
  return await res.json();
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
