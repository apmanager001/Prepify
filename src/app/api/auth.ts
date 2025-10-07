const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Login
export async function login(credentials: { username: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include", // If JWT is in cookie
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// Register
export async function register(data: { username: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

// Logout
export async function logout() {
  const res = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
}

// Get current user
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}
