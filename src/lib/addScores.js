import { API_BASE_URL } from "@/lib/backendAPI";

const addScores = async (type) => {
  // Basic client-side validation
  if (!type || typeof type !== "string") {
    throw new Error("addScores requires a string `type`");
  }

  const response = await fetch(`${API_BASE_URL}/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ type }),
  });

  // parse response body for better error messages
  const text = await response.text().catch(() => "");
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const msg =
      (body && body.error) ||
      (typeof body === "string" && body) ||
      response.statusText;
    throw new Error(`Failed to add scores: ${response.status} ${msg}`);
  }

  return body;
};

export default addScores;
