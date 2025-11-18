import { useQuery } from "@tanstack/react-query";

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
