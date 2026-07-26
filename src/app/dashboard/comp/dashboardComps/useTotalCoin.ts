import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/backendAPI";

export interface CoinDetailsParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  fields?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${txt}`);
  }

  return res.json().catch(() => null);
}

export async function fetchTotalCoins() {
  return fetchJson(`${API_BASE_URL}/coin`);
}

export function useTotalCoins() {
  return useQuery({
    queryKey: ["totalCoins"],
    queryFn: fetchTotalCoins,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export async function fetchCoinDetails(params: CoinDetailsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.fields?.length) {
    searchParams.set("fields", params.fields.join(","));
  }

  const query = searchParams.toString();

  return fetchJson(`${API_BASE_URL}/coin/details${query ? `?${query}` : ""}`);
}

export function useCoinDetails(params: CoinDetailsParams = {}) {
  return useQuery({
    queryKey: ["coinDetails", params],
    queryFn: () => fetchCoinDetails(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
