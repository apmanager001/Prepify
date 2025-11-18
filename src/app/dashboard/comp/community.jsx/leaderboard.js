import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/backendAPI";

// Fetch the leaderboard from the backend.
// Supports optional params: { page, pageSize, sort, filter }
export async function fetchLeaderboard({
  page = 1,
  pageSize = 15,
  sort,
  filter,
} = {}) {
  const params = new URLSearchParams();
  if (page !== undefined) params.set("page", String(page));
  if (pageSize !== undefined) params.set("pageSize", String(pageSize));
  if (sort) params.set("sort", sort);
  if (filter) params.set("filter", filter);

  const url = `${API_BASE_URL}/leaderboard${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Failed to fetch leaderboard: ${res.status} ${txt}`);
  }
  const body = await res.json().catch(() => null);
  return body;
}

export default function useLeaderboard(options = {}) {
  // options: { page, pageSize, sort, filter }
  return useQuery({
    queryKey: ["leaderboard", options],
    queryFn: () => fetchLeaderboard(options),
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}
