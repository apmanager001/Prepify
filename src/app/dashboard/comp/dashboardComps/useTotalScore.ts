import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/backendAPI";

async function fetchTotalScore() {
  const res = await fetch(`${API_BASE_URL}/score`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Failed to fetch total score: ${res.status} ${txt}`);
  }

  // backend may return { totalScore: number } or { score: number } or a raw number
  const body = await res.json().catch(() => null);
  return body;
}

export default function useTotalScore() {
  return useQuery({
    queryKey: ["totalScore"],
    queryFn: fetchTotalScore,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// --- Daily score support --------------------------------------------------
// Backend route: GET /score/daily -> expected to return daily total for the
// authenticated user. Response shape may be { total: number } or { totalScore }
// or a raw number — handle flexibly like fetchTotalScore.
async function fetchDailyScore() {
  const res = await fetch(`${API_BASE_URL}/score/daily`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Failed to fetch daily score: ${res.status} ${txt}`);
  }

  const body = await res.json().catch(() => null);
  return body;
}

export function useDailyScore() {
  return useQuery({
    queryKey: ["dailyScore"],
    queryFn: fetchDailyScore,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export { fetchTotalScore, fetchDailyScore };

// Mutation hook to add score and invalidate relevant queries on success
export function useAddScore() {
  const queryClient = useQueryClient();

  const addScore = async (type: string) => {
    if (!type || typeof type !== "string") {
      throw new Error("addScore requires a string `type`");
    }

    const res = await fetch(`${API_BASE_URL}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type }),
    });

    const text = await res.text().catch(() => "");
    let body: any;
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
      throw new Error(`Failed to add score: ${res.status} ${msg}`);
    }

    return body;
  };

  return useMutation({
    mutationFn: addScore,
    onSuccess: () => {
      // daily score will change when a new score is added — refetch it
      queryClient.invalidateQueries({ queryKey: ["dailyScore"] });
      queryClient.invalidateQueries({ queryKey: ["totalScore"] });
    },
  });
}

// Non-hook helper: perform the same POST and invalidate queries using shared queryClient
import { queryClient } from "@/lib/queryClient";

export async function addScoreAndInvalidate(type: string) {
  if (!type || typeof type !== "string") {
    throw new Error("addScore requires a string `type`");
  }

  const res = await fetch(`${API_BASE_URL}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type }),
  });

  const text = await res.text().catch(() => "");
  let body: any;
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
    throw new Error(`Failed to add score: ${res.status} ${msg}`);
  }

  // invalidate the queries that depend on score
  queryClient.invalidateQueries({ queryKey: ["dailyScore"] });
  queryClient.invalidateQueries({ queryKey: ["totalScore"] });

  return body;
}
